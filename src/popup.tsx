import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { PopoutMessage, ResponseMessage } from "./types";

const Popup = () => {

  const [hasComfyUIElement, setHasComfyUIElement] = useState(false);

  useEffect(() => {
    refresh()
  })
 
  const refresh = () => {
    const isComfyUIMsg:PopoutMessage={
      type:"Command",
      content:"isComfyUI"
    }

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const tab = tabs[0];
      if (tab.id) {
        chrome.tabs.sendMessage(
          tab.id,
          isComfyUIMsg,
          (msg:ResponseMessage) => {
            if(msg.response===true) setHasComfyUIElement(true)
          }
        );
      }
    });
    if (document.querySelector("#queue-button")) {
      setHasComfyUIElement(true)
    }
  }

  return (
    <>
    <div style={{width:"200px"}}>
      {hasComfyUIElement ? <p style={{color:"green", fontWeight:"bold"}}>Activated (on top-left of the page)</p> : <p style={{color:"red"}}>It is not ComfyUI</p> }
      
      </div>
    </>
  );
};

const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
);
