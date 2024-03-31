import React, { useState, useEffect } from "react";
import CameraPage from "./pages/camera";
import Pokedex from "./pages/pokedex";
import { Button, Col } from "rsuite";
import Collection from "./pages/collection";
import { MdCatchingPokemon } from "react-icons/md";
import { IoMdFolderOpen } from "react-icons/io";
import { set } from "date-fns";
import { MdVolumeOff, MdVolumeUp } from "react-icons/md";

function App() {
  const [page, setPage] = useState("camera");
  const [isMuted, setIsMuted] = useState(true);
  const [audio] = useState(new Audio("/public/bg.mp3"));

  useEffect(() => {
    // Ensure audio is muted initially if isMuted is true
    audio.volume = 0;
    if (!isMuted) {
      handleStartMusic();
    }
    // Cleanup function to pause music when component unmounts
    return () => {
      audio.pause();
    };
  }, []); // Empty dependency array means this runs once on mount

  // Function to toggle mute state
  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (isMuted) {
      audio
        .play()
        .catch((error) => console.error("Error playing audio:", error));
      let volume = 0;
      audio.volume = volume;
      const intervalId = setInterval(() => {
        if (volume < 1) {
          volume += 0.1;
          audio.volume = Math.min(volume, 1);
        } else {
          clearInterval(intervalId);
        }
      }, 200);
    } else {
      // Optional: Fade out volume before pausing for a smoother experience
      let volume = audio.volume;
      const intervalId = setInterval(() => {
        if (volume > 0.1) {
          volume -= 0.1;
          audio.volume = volume;
        } else {
          clearInterval(intervalId);
          audio.pause();
          audio.currentTime = 0; // Optionally reset track to start
          audio.volume = 1; // Reset volume for next play
        }
      }, 200);
    }
  };

  const handleStartMusic = () => {
    audio
      .play()
      .then(() => {
        let volume = 0;
        audio.volume = volume;
        const intervalId = setInterval(() => {
          if (volume <= 0.9) {
            volume += 0.1;
            audio.volume = volume;
          } else {
            clearInterval(intervalId);
          }
        }, 200); // Increase volume every 200ms
      })
      .catch((error) => console.error("Error playing audio:", error));
    setPage("camera");
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <div className="bg-gradient-to-r from-green-100 to-emerald-300">
      <div className="flex items-center justify-center">
        <h1 className="text-7xl font-mono font-light text-green-500 backdrop-blur-sm p-4">
          AniDex
        </h1>
        {isMuted ? (
          <MdVolumeOff
            size={40}
            onClick={toggleMute}
            className="hover:fill-green-500 hover:scale-125 mt-3"
          />
        ) : (
          <MdVolumeUp
            size={40}
            onClick={toggleMute}
            className="hover:fill-green-500 hover:scale-125 mt-3"
          />
        )}
      </div>

      {page === "camera" && <CameraPage />}
      {page === "collection" && <Collection />}
      <footer className="fixed bottom-0 m-1 w-full mx-auto">
        <nav className="flex flex-row justify-evenly">
          <div class=" w-1/2 text-5xl flex bg-gray-300 p-4 rounded-lg border-solid border-zinc-500 border-4">
            <MdCatchingPokemon
              size={50}
              onClick={() => handlePageChange("camera")}
              className="hover:fill-green-500 hover:scale-125 justify-center mx-auto"
            />
          </div>
          <div class="w-1/2 text-5xl flex  bg-gray-300 p-4 rounded-lg border-solid border-zinc-500 border-4">
            <IoMdFolderOpen
              size={50}
              onClick={() => handlePageChange("collection")}
              className="hover:fill-green-500 hover:scale-125 justify-center mx-auto"
            />
          </div>
        </nav>
      </footer>
    </div>
  );
}

export default App;
