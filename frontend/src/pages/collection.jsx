import React, { Component, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Collection({ setCurrentImage }) {
  const [display, setDisplay] = useState("all");
  const [imageUrls, setImages] = useState([]);

  useEffect(() => {
    fetch("/api/getpokeimages")
      .then((response) => response.json())
      .then((data) => {
        setImages(data);
        console.log(data);
      })
      .catch((error) => console.error("Error fetching images:", error));
  }, []);

  const handleClickSprite = (image) => {
    console.log("Image clicked:", image);
    setCurrentImage(image);
  };

  // type property should display based on filter
  return (
    <div>
      <ul className="w-full">
        <button
          className="w-1/3 font-mono border-solid border-2 border-slate-400 bg-white py-5 text-lg font-bold"
          onClick={() => setDisplay("land")}
        >
          Land
        </button>
        <button
          className="w-1/3 font-mono order-solid border-2 border-slate-400 bg-white py-5 text-lg font-bold"
          onClick={() => setDisplay("sea")}
        >
          Sea
        </button>
        <button
          className="w-1/3 font-mono border-solid border-2 border-slate-400 bg-white py-5 text-lg font-bold"
          onClick={() => setDisplay("all")}
        >
          All
        </button>
      </ul>
      <div className="flex flex-wrap min-h-dvh" id="All-Objects">
        {imageUrls.map((image, index) => {
          if (display === image.type || display === "all") {
            return (
              <div className="w-1/2">
                <div
                  className="m-5 rounded-lg bg-white"
                  style={{ backgroundColor: image.color }}
                  key={index}
                >
                  <img
                    src={`data:image/png;base64,${image.spriteImageBase64Json}`}
                    alt={image.name}
                    className="mb-0 pb-0 rounded-t-lg "
                    onClick={() => {
                      handleClickSprite(image);
                    }}
                  />
                  <div className="bg-green-500 rounded-b-lg w-full">
                    <p className="text-base font-mono font-bold m-0 p-0 text-gray-900 bg">
                      {image.name}
                    </p>
                    <p className="text-sm font-mono m-0 p-0 text-gray-900 bg">
                      Type: {image.type}
                    </p>
                  </div>
                </div>
              </div>
            );
          } else {
            return null;
          }
        })}
      </div>
      <div className="h-[100px] w-[100px] bg-transparent"></div>
    </div>
  );
}

export default Collection;
