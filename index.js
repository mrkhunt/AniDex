import express from "express";
import { VertexAI } from "@google-cloud/vertexai";
import OpenAI from "openai";

const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(express.static("frontend/dist"));

import axios from "axios";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  addDoc,
} from "firebase/firestore";
import dotenv from "dotenv";
import { log } from "console";
dotenv.config();
const port = process.env.PORT || 8080;

// Reverse geocoding API key from env
const geocodeApiKey = process.env.GOOGLE_MAPS_API_KEY;
const openaiAPIKey = process.env.OPENAI_API_KEY;

// OpenAI init
const openai = new OpenAI(openaiAPIKey);

// Initialize Vertex with your Cloud project and location
const vertex_ai = new VertexAI({
  project: "genesisai-418720",
  location: "us-central1",
});
const model = "gemini-1.0-pro-vision-001";

// Instantiate the models
const generativeModel = vertex_ai.preview.getGenerativeModel({
  model: model,
  generationConfig: {
    maxOutputTokens: 2048,
    temperature: 0.4,
    topP: 1,
    topK: 32,
  },
  safetySettings: [
    {
      category: "HARM_CATEGORY_HATE_SPEECH",
      threshold: "BLOCK_MEDIUM_AND_ABOVE",
    },
    {
      category: "HARM_CATEGORY_DANGEROUS_CONTENT",
      threshold: "BLOCK_MEDIUM_AND_ABOVE",
    },
    {
      category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
      threshold: "BLOCK_MEDIUM_AND_ABOVE",
    },
    {
      category: "HARM_CATEGORY_HARASSMENT",
      threshold: "BLOCK_MEDIUM_AND_ABOVE",
    },
  ],
});

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "genesisai-418720.firebaseapp.com",
  projectId: "genesisai-418720",
  storageBucket: "genesisai-418720.appspot.com",
  messagingSenderId: "227414785078",
  appId: "1:227414785078:web:ff114a3d2c183b6636ec97",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.post("/api/saveImage", async (req, res) => {
  const { imageBase64, lat, long, date } = req.body;
  if (!imageBase64) {
    return res.status(400).send("No image data provided");
  }
  if (!lat || !long || !date) {
    return res.status(400).send("Missing location or time data");
  }

  // Extract imageBase64 text from imageBase64 by splitting and taking 2nd element of the array
  const imageBase64Text = imageBase64.split(",")[1];

  const image = {
    inlineData: {
      mimeType: "image/jpeg",
      data: imageBase64Text,
    },
  };

  async function generateContent() {
    const req = {
      contents: [
        {
          role: "user",
          parts: [
            image,
            {
              text: `Look at this animal. Find me the name of the specific species of this animal as well as classify whether it is a land animal or a sea animal. Additionally, I would like you to derive what surroundings(sea, forest, desert, arctic) this thing is usually found in and extract the set the colour based on that surroundings(STRICTLY blue for sea, green for forest, brown for desert, white for arctic). Please return strictly a JSON object with the keys name, type (land or sea) and colour of the surroundings. Additionally, for this animal, assess it's vulnerability such as whether it is a least concern,less vulnerable, vulnerable, endangered or critically endangered species. Furthermore, you should also find the usual height, weight and lifespan for this particular animal. Your return must strictly start and end with curly braces only. The format of return has the keys : height: height of animal, weight: weight of animal, lifespan: lifespan of animal, name: name of animal, type: type, colour: colour of surroundings, vulnerability: level of vulnerability.
              `,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.0,
      },
    };

    const streamingResp = await generativeModel.generateContentStream(req);

    // Return the text
    return await streamingResp.response;
  }

  let stringLocation = "";

  let geminiReturnObject = await generateContent();
  let geminiResponseObject;
  try {
    console.log(
      "Gemini response text:",
      geminiReturnObject.candidates[0].content.parts[0].text
    );
    geminiResponseObject = JSON.parse(
      geminiReturnObject.candidates[0].content.parts[0].text
    );
  } catch (error) {
    try {
      // Remove ```json and ``` from the string
      const jsonString = geminiReturnObject.candidates[0].content.parts[0].text;
      const cleanedString = jsonString
        .replace("JSON", "")
        .replace("```JSON", "")
        .replace("```json", "")
        .replace("```", "")
        .replace("```", "");
      console.log("Cleaned JSON string:", cleanedString);
      geminiResponseObject = JSON.parse(cleanedString);
    } catch {
      console.error("Error parsing Gemini response:", error);
      console.log(geminiReturnObject);
      return res.status(500).send("Error parsing Gemini response");
    }
  }

  // Generate Sprite Image using DALLE-2

  const response = await openai.images.generate({
    model: "dall-e-2",
    prompt:
      "low res pixel image of a " +
      geminiResponseObject.name +
      "with a white background",
    n: 1,
    size: "256x256",
    response_format: "b64_json",
  });

  const spriteImageBase64Json = response.data[0].b64_json;

  // Get the string location data using Google API
  const geocodingURL = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=${geocodeApiKey}`;

  console.log("Geocoding URL:", geocodingURL);

  try {
    const response = await axios.get(geocodingURL);
    const data = response.data;

    if (data.status === "OK") {
      if (data.results.length > 0) {
        stringLocation = data.results[0].formatted_address;
        console.log("Location data:", stringLocation);
      }
    } else {
      stringLocation = "Unknown Location";
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to reverse geocoding data");
  }

  console.log({
    imageBase64: imageBase64,
    lat: lat,
    long: long,
    date: date,
    formattedAddress: stringLocation,
    name: geminiResponseObject.name,
    type: geminiResponseObject.type,
    color: geminiResponseObject.colour,
    spriteImageBase64Json: spriteImageBase64Json,
  });

  try {
    // Save image data to Firebase
    const docRef = await addDoc(collection(db, "test"), {
      imageBase64: imageBase64,
      lat: lat,
      long: long,
      date: date,
      formattedAddress: stringLocation,
      name: geminiResponseObject.name,
      type: geminiResponseObject.type,
      colour: geminiResponseObject.colour,
      spriteImageBase64Json: spriteImageBase64Json,
      height: geminiResponseObject.height,
      weight: geminiResponseObject.weight,
      lifespan: geminiResponseObject.lifespan,
      vulnerability: geminiResponseObject.vulnerability,
    });
    console.log("Image saved successfully:", docRef.id);

    // Call Gemini API to generate response
    // const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
    // const prompt = "Describe this image.";
    // const imagePart = {
    //   data: Buffer.from(fs.readFileSync(imageBase64)).toString("base64"),
    //   mimeType: "image/png",
    // };

    // const result = await model.generateContent([prompt, imagePart]);
    // const response = await result.response;
    // const text = await response.text();

    res.send({ success: true, id: docRef.id });
  } catch (error) {
    console.error("Error saving image:", error);
    res.status(500).send("Error saving image");
  }
});

app.get("/api/getpokeimages", async (req, res) => {
  const pokeImages = [];
  const q = query(collection(db, "test"));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    pokeImages.push(data);
  });
  res.send(pokeImages);
});

async function generateStory(prompt) {
  try {
    // Generate story based on the prompt
    const result = await chat.sendMessageStream(prompt);
    const response = (await result.response).candidates[0].content;

    return response;
  } catch (error) {
    throw new Error("Error generating story: " + error);
  }
}

app.get("/api/generateStory", async (req, res) => {
  try {
    // Get prompt from query parameters
    const prompt = req.query.prompt;
    console.log("Prompt:", prompt);
    console.log(req.query.currentImage);

    // Generate story based on the prompt
    const generatedContent = await generateStory(prompt);

    // Send the generated story in the response
    res.json({ success: true, story: generatedContent });
  } catch (error) {
    console.error("Error generating story:", error);
    res.status(500).json({ success: false, error: "Error generating story" });
  }
});

app.post("/api/saveChat", async (req, res) => {
  try {
    const { chatlog } = req.body;

    // Assuming `chatlog` is an array of chat messages
    // Iterate through each message and save it to Firestore
    for (const message of chatlog) {
      // Add the message to the "chatlog" collection in Firestore
      await addDoc(collection(db, "chatlog"), message);
    }

    console.log("Chat log saved successfully");
    res.send({ success: true, message: "Chat log saved successfully" });
  } catch (error) {
    console.error("Error saving chat log:", error);
    res.status(500).send("Error saving chat log");
  }
});

const text1_1 = {
  text: `Your name is {animal}, greet and refer the audience as Dexplorer. To begin, introduce yourself as {animal} specialist and tell users a fun fact about yourself. Keep your introduction to 4 lines and all your responses to 5 lines max. You should know a lot about yourself and every aspect of the animal you are including:

vulnerability (endangerment) habitat weight/height specie diet life span`,
};

const chat = generativeModel.startChat({});

async function sendMessage(message) {
  const streamResult = await chat.sendMessageStream(message);
  process.stdout.write(
    "stream result: " +
      JSON.stringify((await streamResult.response).candidates[0].content) +
      "\n"
  );
}

async function generateContent() {
  await sendMessage([text1_1]);
  await sendMessage([{ text: `tell me about your habitat` }]);
  await sendMessage([{ text: `what is your diet` }]);
  await sendMessage([{ text: `do you apply in urban areas` }]);
}

generateContent();
