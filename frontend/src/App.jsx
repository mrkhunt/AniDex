// import React, { useState } from "react";
// import axios from "axios";

// function UploadImage() {
//   const [image, setImage] = useState("");

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     const reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onloadend = () => {
//       setImage(reader.result);
//     };
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post("/api/saveImage", {
//         imageBase64: image,
//       });
//       console.log("Image saved successfully:", response.data);
//     } catch (error) {
//       console.error("Error saving image:", error);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <input type="file" onChange={handleImageChange} accept="image/*" />
//       <button type="submit">Upload Image</button>
//     </form>
//   );
// }

// export default UploadImage;

import React, { useState } from "react";
import CameraPage from "./pages/camera";
import Pokedex from "./pages/pokedex";
import { Button } from "rsuite";

function App() {
  const [page, setPage] = useState("camera");

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <div>
      {page === "camera" ? <CameraPage /> : <Pokedex />}
      <header>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            marginTop: "10px",
            marginBottom: "10px",
          }}
        >
          <h1>AnimaDex</h1>
        </div>
      </header>
      {page === "camera" ? <CameraPage /> : <Pokedex />}
      <footer>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            marginTop: "10px",
            marginBottom: "10px",
          }}
        >
          <nav>
            <Button onClick={() => handlePageChange("camera")}>Camera</Button>
            <Button onClick={() => handlePageChange("pokedex")}>Pokedex</Button>
          </nav>
        </div>
      </footer>
    </div>
  );
}

export default App;
