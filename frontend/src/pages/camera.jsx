import React, { useState, useEffect, useRef } from "react";
import { Button, toaster, Message } from "rsuite";
import { Icon } from "@rsuite/icons";
import { FaCamera, FaRedo, FaCheck } from "react-icons/fa"; // Import additional icons
import "rsuite/dist/rsuite.min.css"; // Import rsuite styles
import axios from "axios";

const CameraPage = () => {
  const videoRef = useRef(null);
  const photoRef = useRef(null);
  const [lat, setLat] = useState(null);
  const [long, setLong] = useState(null);

  const [image, setImage] = useState(null);
  const [hasPhoto, setHasPhoto] = useState(false);

  const [loading, setLoading] = useState(false);

  const getVideo = () => {
    navigator.mediaDevices
      .getUserMedia({
        video: {
          width: 400,
          height: 400,
        },
      })
      .then((stream) => {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      })
      .catch((err) => {
        console.error("Error getting video stream:", err);
      });
  };

  const getUserLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      console.log("Latitude:", position.coords.latitude);
      console.log("Longitude:", position.coords.longitude);
      setLat(position.coords.latitude);
      setLong(position.coords.longitude);
    });
  };

  const takePhoto = () => {
    const width = 400;
    const height = 400;
    let video = videoRef.current;
    let photo = photoRef.current;

    photo.width = width;
    photo.height = height;

    let ctx = photo.getContext("2d");
    ctx.drawImage(video, 0, 0, width, height);

    // Downscale image to 200 by 200
    let canvas = document.createElement("canvas");
    canvas.width = 200;
    canvas.height = 200;
    canvas.getContext("2d").drawImage(photo, 0, 0, 200, 200);

    // Get image as base64
    let image = canvas.toDataURL("image/png");
    setImage(image);

    console.log("Image:", image);

    setHasPhoto(true);
  };

  const redoPhoto = () => {
    setLoading(false);
    setHasPhoto(false);
    // Clear the canvas if needed. Example:
    let photo = photoRef.current;
    photo.height = 0;

    // Call getVideo to start the camera again
    getVideo();
  };

  const sendPhotoToBackend = async () => {
    setLoading(true);
    try {
      let date = new Date().toISOString();

      console.log("Sending photo to backend...");

      const response = await axios
        .post("/api/saveImage", {
          imageBase64: image,
          lat: lat,
          long: long,
          date: date,
        })
        .then((response) => {
          alert("Added to AnyDex!");

          redoPhoto();
          console.log("Image saved successfully:", response.data);
        });
    } catch (error) {
      console.error("Error saving image:", error);
      alert("Please try again!");
      redoPhoto();
    }
  };

  useEffect(() => {
    getVideo();
  }, [videoRef]);

  // When user opens page, capture lat long
  useEffect(() => {
    try {
      getUserLocation();
    } catch (error) {
      console.error("Error getting location:", error);
      alert.error(
        "Error getting location, try enabling permissions and refreshing the page."
      );
    }
  }, []);

  return (
    <div className="h-screen flex flex-col items-center">
      {loading && (
        <div className="flex flex-col justify-center items-center gap-3 mt-8 mb-3 bg-transparent">
          <img
            className="mt-6"
            src="https://media.tenor.com/yRSnf6wABQ4AAAAi/pato-duck.gif"
          />
          <p className="text-2xl">Loading...</p>
        </div>
      )}
      {!hasPhoto && !loading && (
        <div>
          <div className="flex justify-center gap-3 mt-8 mb-3 bg-transparent">
            <video
              ref={videoRef}
              width={window.innerWidth}
              height={window.innerHeight}
              className="rounded-2xl max-w-[80vw] max-h-[60vh]"
            />
          </div>

          <div className="flex justify-center gap-10 mt-10">
            <Button appearance="ghost" onClick={takePhoto}>
              <Icon
                style={{ color: "black", marginRight: "1em" }}
                as={FaCamera}
              />
              SNAP
            </Button>
          </div>
        </div>
      )}

      <div className="flex justify-center gap-3 mt-8 rounded-2xl">
        <canvas
          ref={photoRef}
          height={0}
          className={`max-w-[80vw] max-h-[60vh] rounded-2xl ${
            loading ? "hidden" : "block"
          }`}
        />
      </div>

      {hasPhoto && !loading && (
        <div>
          <div className="flex justify-center gap-10 mt-10">
            <Button appearance="primary" color="red" onClick={redoPhoto}>
              <Icon as={FaRedo} /> Redo
            </Button>
            <Button
              appearance="primary"
              color="green"
              onClick={() => sendPhotoToBackend()}
              loading={loading}
            >
              <Icon as={FaCheck} /> Confirm
            </Button>
          </div>
        </div>
      )}
      <div className="h-[80px]"></div>
    </div>
  );
};

export default CameraPage;
