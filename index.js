import express from "express";
import { VertexAI } from "@google-cloud/vertexai";

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
const port = process.env.PORT || 8080;

// Gemini Code
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

// Load all API keys
import dotenv from "dotenv";
dotenv.config();

const firebaseConfig = {
  apiKey: "AIzaSyAHV0TnOOOuax-DJPjLvgTW-wB7qfvqp_Y",
  authDomain: "genesisai-418720.firebaseapp.com",
  projectId: "genesisai-418720",
  storageBucket: "genesisai-418720.appspot.com",
  messagingSenderId: "227414785078",
  appId: "1:227414785078:web:ff114a3d2c183b6636ec97",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

// Reverse geocoding API key from env
const geocodeApiKey = process.env.GOOGLE_MAPS_API_KEY;

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
              text: `Look at this object. Return me strictly the name of this thing as well as classify it as whether it is an animal or object. Please return strictly a JSON object with the keys name and type (object or animal). Your return must start and end with curly braces only.`,
            },
          ],
        },
      ],
    };

    const streamingResp = await generativeModel.generateContentStream(req);

    // Return the text
    return await streamingResp.response;
  }

  let stringLocation = "";

  let geminiReturnObject = await generateContent();

  let geminiResponseObject = JSON.parse(
    geminiReturnObject.candidates[0].content.parts[0].text
  );

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
  });

  try {
    // Save image data to Firebase
    const docRef = await addDoc(collection(db, "images"), {
      imageBase64: imageBase64,
      lat: lat,
      long: long,
      date: date,
      formattedAddress: stringLocation,
      name: geminiResponseObject.name,
      type: geminiResponseObject.type,
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


app.get("/api/generateStory", async (req, res) => {
  try {
    // Define prompt
    const prompt = req.query.prompt;
    console.log("Prompt:", prompt);

    // Generate story based on the prompt using the instantiated generative model
    const model = vertex_ai.preview.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = result.response;

    // Send the generated story in the response
    if (response.candidates && response.candidates.length > 0) {
      // Access the first candidate's content
      const generatedContent = response.candidates[0].content;
      console.log("Generated Content:", generatedContent);
      res.send({ success: true, story: generatedContent });
    }
  } catch (error) {
    console.error("Error generating story:", error);
    res.status(500).send("Error generating story");
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
