import React from "react";
import ChatBubble from "../components/ChatBubble";
import ChatBubbleRespond from "../components/ChatBubbleRespond";
import InfoTag from "../components/InfoTag";
import Chatbox from "../components/Chatbox";

const Pokedex = ({ currentImage }) => {
  console.log({ currentImage });
  return (
    <div className="">
      <div className="flex aspect-auto justify-between bg-orange-300 p-4">
        <img
          src={`data:image/png;base64,${currentImage.spriteImageBase64Json}`}
          className="bg-slate-50 rounded-md aspect-square max-h-[100px]"
        />
        <div>
          <InfoTag text={"Type: " + currentImage.type} />
          <InfoTag text={"Height: " + currentImage.height} />
          <InfoTag text={"Weight: " + currentImage.weight} />
          <InfoTag text={"Lifespan: " + currentImage.lifespan} />
          <InfoTag text={"Vulnerability: " + currentImage.vulnerability} />
        </div>
        <div>
          <p>
            Last met: {currentImage.formattedAddress} on {currentImage.date}
          </p>
        </div>
      </div>
      <div className="m-5">
        <Chatbox currentImage={currentImage} />
      </div>
    </div>
  );
};

export default Pokedex;
