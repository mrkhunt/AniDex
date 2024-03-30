import React, { useState } from "react";
import "rsuite/dist/rsuite.min.css";
import { Button, FlexboxGrid, Container, Header, Content, Modal } from "rsuite";

function CameraPage() {
  const [image, setImage] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState(null);
  const videoRef = React.createRef();

  const handleTakePicture = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const userMedia = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        setStream(userMedia);
        setShowCamera(true);
        if (videoRef.current) {
          videoRef.current.srcObject = userMedia;
        }
      } catch (error) {
        console.error("Error accessing the camera", error);
      }
    }
  };

  const handleCloseCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    setShowCamera(false);
    setStream(null);
  };

  const handleCapture = () => {
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      const imageUrl = URL.createObjectURL(blob);
      setImage(imageUrl);
    }, "image/png");
    handleCloseCamera();
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };

  return (
    <Container>
      <Header>
        <h1>AnimaDex</h1>
        <p>Start your animadex journey today!</p>
      </Header>
      <Content>
        <FlexboxGrid
          justify="space-around"
          align="middle"
          style={{ height: "80vh" }}
        >
          <FlexboxGrid.Item colspan={22}>
            <div style={{ textAlign: "center" }}>
              <img
                src={image}
                alt="Upload Preview"
                style={{ width: "100%", marginBottom: 20 }}
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ marginBottom: 20 }}
              />
              <br />
              <Button
                appearance="primary"
                onClick={handleTakePicture}
                style={{ marginRight: 10 }}
              >
                Take Picture
              </Button>
              <Button
                appearance="secondary"
                onClick={() =>
                  document.querySelector("input[type=file]").click()
                }
              >
                Upload Picture
              </Button>
            </div>
          </FlexboxGrid.Item>
        </FlexboxGrid>
      </Content>

      <Modal show={showCamera} onHide={handleCloseCamera} size="xs">
        <Modal.Header>
          <Modal.Title>Capture Image</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <video ref={videoRef} autoPlay style={{ width: "100%" }}></video>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleCapture} color="green">
            Capture
          </Button>
          <Button onClick={handleCloseCamera} appearance="subtle">
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default CameraPage;
