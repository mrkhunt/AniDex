import React, { useState, useEffect, useRef } from "react";
import { Button, toaster, Message } from "rsuite";
import { Icon } from "@rsuite/icons";
import { FaCamera, FaRedo, FaCheck } from "react-icons/fa"; // Import additional icons
import "rsuite/dist/rsuite.min.css"; // Import rsuite styles
import axios from "axios";

const CameraPage = () => {
  const videoRef = useRef(null);
  const photoRef = useRef(null);

  const [image, setImage] = useState(null);
  const [hasPhoto, setHasPhoto] = useState(false);

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
    setHasPhoto(false);
    // Clear the canvas if needed. Example:
    let photo = photoRef.current;
    photo.height = 0;

    // Call getVideo to start the camera again
    getVideo();
  };

  const sendPhotoToBackend = async () => {
    try {
      console.log("Sending photo to backend...");
      const response = await axios
        .post("/api/saveImage", {
          imageBase64: image,
        })
        .then((response) => {
          toaster.push(
            <Message type="success" closable>
              Added to AnyDex!
            </Message>
          );
          redoPhoto();
          console.log("Image saved successfully:", response.data);
        });
    } catch (error) {
      console.error("Error saving image:", error);
    }
  };

  useEffect(() => {
    getVideo();
  }, [videoRef]);

  return (
    <div>
      {!hasPhoto && (
        <div>
          <video ref={videoRef} width="400" height="400" />

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "10px",
              marginTop: "10px",
            }}
          >
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
      <div>
        <canvas ref={photoRef} height="0" />
        {hasPhoto && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "10px",
              marginTop: "10px",
            }}
          >
            <Button appearance="primary" color="red" onClick={redoPhoto}>
              <Icon as={FaRedo} /> Redo
            </Button>
            <Button
              appearance="primary"
              color="green"
              onClick={() => sendPhotoToBackend()}
            >
              <Icon as={FaCheck} /> Confirm
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CameraPage;
