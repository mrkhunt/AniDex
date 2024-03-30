import express from "express";
import os from "os";
import fs from "fs";

const app = express();
app.use(express.json());
app.use(express.static("frontend/dist"));
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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Endpoint to save base64 image
app.post("/api/saveImage", async (req, res) => {
  const { imageBase64 } = req.body;
  if (!imageBase64) {
    return res.status(400).send("No image data provided");
  }

  // Gemini Code here
  //   async function sendMultiModalPromptWithImage(
  //     projectId = "genesisai-418720",
  //     location = "us-central1",
  //     model = "gemini-1.0-pro-vision"
  //   ) {
  //     // Initialize Vertex with your Cloud project and location
  //     const vertexAI = new VertexAI({ project: projectId, location: location });

  //     const generativeVisionModel = vertexAI.getGenerativeModel({
  //       model: model,
  //     });

  //     // Pass multimodal prompt
  //     const request = {
  //       contents: [
  //         {
  //           role: "user",
  //           parts: [
  //             {
  //               inlineData: {
  //                 data: imageBase64,
  //                 mimeType: "image/jpeg",
  //               },
  //             },
  //             {
  //               text: "What is this image?",
  //             },
  //           ],
  //         },
  //       ],
  //     };

  //     // Create the response
  //     const response = await generativeVisionModel.generateContent(request);
  //     // Wait for the response to complete
  //     const aggregatedResponse = await response.response;
  //     // Select the text from the response
  //     const fullTextResponse =
  //       aggregatedResponse.candidates[0].content.parts[0].text;

  //     console.log(fullTextResponse);
  //   }

  //   sendMultiModalPromptWithImage();

  try {
    // Save image data to Firebase
    const docRef = await addDoc(collection(db, "images"), {
      imageBase64,
    });
    console.log("Image saved successfully:", docRef.id);
    res.send({ success: true, id: docRef.id });
  } catch (error) {
    console.error("Error saving image: ", error);
    res.status(500).send("Error saving image");
  }
});
