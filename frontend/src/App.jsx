import React, { useState } from "react";
import axios from "axios";

function UploadImage() {
  const [image, setImage] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImage(reader.result);
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/saveImage", {
        imageBase64: image,
      });
      console.log("Image saved successfully:", response.data);
    } catch (error) {
      console.error("Error saving image:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" onChange={handleImageChange} accept="image/*" />
      <button type="submit">Upload Image</button>
    </form>
  );
}

export default UploadImage;
