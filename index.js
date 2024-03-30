import express from "express";

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

// Endpoint to save base64 image
app.post("/api/saveImage", async (req, res) => {
  const { imageBase64, lat, long, date } = req.body;
  let stringLocation = "";
  if (!imageBase64) {
    return res.status(400).send("No image data provided");
  }
  if (!lat || !long || !date) {
    return res.status(400).send("Missing location or time data");
  }

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

  try {
    // Save image data to Firebase
    const docRef = await addDoc(collection(db, "images"), {
      imageBase64: imageBase64,
      lat: lat,
      long: long,
      date: date,
      formattedAddress: stringLocation,
    });
    console.log("Image saved successfully:", docRef.id);
    res.send({ success: true, id: docRef.id });
  } catch (error) {
    console.error("Error saving image: ", error);
    res.status(500).send("Error saving image");
  }
});
