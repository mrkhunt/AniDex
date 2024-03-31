import React from "react";

const ChatBubbleRespond = ({ time, text }) => {
  return (
    <div class="flex flex-row-reverse gap-2.5 p-2">
      <img class="w-8 h-8 rounded-full bg-slate-300" src="/user.jpg" />
      <div class="flex flex-col w-full max-w-[320px] leading-1.5 bg-slate-300 p-1 rounded-md">
        <div class="flex items-center space-x-2 rtl:space-x-reverse">
          <span class="text-sm font-semibold text-gray-900 ">You</span>
          <span class="text-sm font-normal text-gray-500 ">{time}</span>
        </div>
        <p class="text-sm font-normal py-2 text-gray-900 bg">
          {" "}{text}
        </p>
      </div>
    </div>
  );
};

export default ChatBubbleRespond;
