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
import { IoMdFolderOpen } from "react-icons/io";

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
      {page === "camera" && <CameraPage />}
      {page === "collection" && <Collection />}
      <footer className="fixed bottom-0 m-6 w-full mx-auto">
        <nav className="flex flex-row  gap-10 justify-evenly">
          <div class=" text-5xl justify-center size-fit bg-slate-50 p-4 rounded-2xl border-solid border-2 border-zinc-800">
            <MdCatchingPokemon
              size={80}
              onClick={() => handlePageChange("camera")}
              className="hover:fill-red-300 hover:scale-125"
            />
          </div>
          <div class="text-5xl justify-center size-fit bg-slate-50 p-4 rounded-2xl border-solid border-2 border-zinc-800">
            <IoMdFolderOpen
              size={80}
              onClick={() => handlePageChange("collection")}
              className="hover:fill-red-300 hover:scale-125"
            />
          </div>
        </nav>
      </footer>
    </div>
  );
}

export default App;
