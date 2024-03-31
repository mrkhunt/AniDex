import React, { Component, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Collection() {
  const [isVisible, setIsVisible] = useState(true);
  const [display, setDisplay] = useState("All");

  const [imageUrls, setImageUrls] = useState([
    //tests for now
    {
      url: "https://static.vecteezy.com/system/resources/thumbnails/002/002/403/small/man-with-beard-avatar-character-isolated-icon-free-vector.jpg",
      name: "santa",
      type: "animal",
    },
    {
      url: "https://static.vecteezy.com/system/resources/thumbnails/021/770/056/small/avatar-of-a-student-character-free-vector.jpg",
      name: "rudoplh",
      type: "obj",
    },
    {
      url: "https://static.vecteezy.com/system/resources/thumbnails/005/129/844/small/profile-user-icon-isolated-on-white-background-eps10-free-vector.jpg",
      name: "candycane",
      type: "animal",
    },
    {
      url: "https://static.vecteezy.com/system/resources/thumbnails/008/846/297/small/cute-boy-avatar-png.png",
      name: "deer",
      type: "obj",
    },
  ]);

  /*useEffect(() => {
    fetch('/api/getpokedeximages')
      .then(response => response.json())
      .then(data => {
        const initializedImages = data.map(image => ({
          url: image.url || '',
          name: image.name || '',
          type: image.type || ''
        }));
        setImages(initializedImages);
      })
      .catch(error => console.error('Error fetching images:', error));
  }, []);*/

  // type property should display based on filter
  return (
    <div>
      <ul>
        <button onClick={() => setDisplay("animal")}>Animals</button>
        <button onClick={() => setDisplay("obj")}>Objects</button>
        <button onClick={() => setDisplay("All")}>All</button>
      </ul>
      <div className="" id="All-Objects">
        {imageUrls.map((image, index) => {
          if (display === image.type || display === "All") {
            return (
              <div key={index} className="">
                <button onClick={() => console.log("clicked")}>
                  <img src={image.url} alt={image.name} />
                  <p>{image.name}</p>
                  <p>{image.type}</p>
                </button>
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
