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
import { Button, Col } from "rsuite";
import Collection from "./pages/collection";
import { MdCatchingPokemon } from "react-icons/md";

function App() {
  const [page, setPage] = useState("camera");

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <div className="bg-gradient-to-r from-green-100 to-emerald-300">
      <h1 className="text-7xl font-black text-green-500 text-center backdrop-blur-sm p-4">
        AniDex
      </h1>
      {page === "camera" ? <CameraPage /> : <Collection />}
      <footer className="fixed bottom-0 m-6 w-full mx-auto bg-transparent">
        <nav className="flex flex-row">
          <div class="gap-10 text-5xl w-full flex justify-center">
            <MdCatchingPokemon
              size={80}
              onClick={() => handlePageChange("camera")}
              className="hover:fill-green-300 hover:scale-125"
            />
          </div>
          <div>
            <Button
              onClick={() => handlePageChange("collect")}
              className="absolute right-0 h-full w-[150px]"
            >
              Collect
            </Button>
          </div>
        </nav>
      </footer>
    </div>
  );
}

export default App;
