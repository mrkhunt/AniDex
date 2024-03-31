import React from "react";
import ChatBubble from "../components/ChatBubble";
import ChatBubbleRespond from "../components/ChatBubbleRespond";
import InfoTag from "../components/InfoTag";
import Chatbox from "../components/Chatbox";

const Pokedex = () => {

  return (
    <div className="">
      <div className="flex aspect-auto justify-between bg-orange-300 p-4">
        <img src="/character.png" className="bg-slate-50 rounded-md aspect-square max-h-[100px]" />
        <div>
          <InfoTag />
          <InfoTag />
          <InfoTag />
          <InfoTag />
          <InfoTag />
          <InfoTag />
          <InfoTag />
        </div>
      </div>
      <div>
        <ChatBubble />{" "}
        <ChatBubbleRespond />{" "}
      </div>
      <div className="m-5">
        <Chatbox />
      </div>
    </div>
  );
};

export default Pokedex;
