import React, { Component, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

/*    {
      url: "https://static.vecteezy.com/system/resources/thumbnails/002/002/403/small/man-with-beard-avatar-character-isolated-icon-free-vector.jpg",
      name: "santa",
      type: "animal",
      colour: "yellow",
    },
    {
      url: "https://static.vecteezy.com/system/resources/thumbnails/021/770/056/small/avatar-of-a-student-character-free-vector.jpg",
      name: "rudoplh",
      type: "obj",
      colour: "1da1f2",
    },
    {
      url: "https://static.vecteezy.com/system/resources/thumbnails/005/129/844/small/profile-user-icon-isolated-on-white-background-eps10-free-vector.jpg",
      name: "candycane",
      type: "animal",
      colour: "ff0000",
    },
    {
      url: "https://static.vecteezy.com/system/resources/thumbnails/008/846/297/small/cute-boy-avatar-png.png",
      name: "deer",
      type: "obj",
      colour: "ffff00",
    },
    {
      url: "https://static.vecteezy.com/system/resources/thumbnails/008/846/297/small/cute-boy-avatar-png.png",
      name: "deer",
      type: "obj",
    },
*/
//hard tests ^

function Collection() {
  const [display, setDisplay] = useState("All");

  const [imageUrls, setImages] = useState([]);

  useEffect(() => {
    fetch("/api/getpokeimages")
      .then((response) => response.json())
      .then((data) => {
        setImages(data);
      })
      .catch((error) => console.error("Error fetching images:", error));
  }, []);

  // type property should display based on filter
  return (
    <div>
      <ul className="w-full">
        <button
          className="w-1/3 font-mono border-solid border-2 border-slate-400 bg-white py-5 text-lg font-bold"
          onClick={() => setDisplay("animal")}
        >
          Animals
        </button>
        <button
          className="w-1/3 font-mono order-solid border-2 border-slate-400 bg-white py-5 text-lg font-bold"
          onClick={() => setDisplay("obj")}
        >
          Objects
        </button>
        <button
          className="w-1/3 font-mono border-solid border-2 border-slate-400 bg-white py-5 text-lg font-bold"
          onClick={() => setDisplay("All")}
        >
          All
        </button>
      </ul>
      <div className="flex flex-wrap" id="All-Objects">
        {imageUrls.map((image, index) => {
          if (display === image.type || display === "All") {
            return (
              <div className="w-1/2">
                <div
                  className="m-5 rounded-lg bg-green-500"
                  style={{ backgroundColor: image.color }}
                  key={index}
                >
                  <button className="" onClick={() => console.log("clicked")}>
                    <img
                      src={`data:image/png;base64,${image.spriteImageBase64Json}`}
                      alt={image.name}
                      className="mb-0 pb-0"
                    />
                    <p className="text-base font-mono font-bold m-0 p-0 text-gray-900 bg">
                      {image.name}
                    </p>
                    <p className="text-sm font-mono m-0 mb-2 p-0 text-gray-900 bg">
                      Type: {image.type}
                    </p>
                  </button>
                </div>
              </div>
            );
          } else {
            return null;
          }
        })}
      </div>
    </div>
  );
}

export default Collection;
