import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { clone } from "./script/utils";
import { DragImage } from "./resources/Images";
import { PopoutMessage, ResponseMessage } from "./types";


const uploadedText: { original: Array<string>, rows: Array<Array<string>>, el: Array<HTMLTextAreaElement> } = { original: [], rows: [], el: [] }

const DetailedAppContainer = () => {
  const [mouseIn, setMouseIn] = useState(false)
  const [times, setTimes] = useState(0)
  const [lag, setLag] = useState(500)
  const [formatter, setFormatter] = useState<{ placeholder: Array<string>, fileNames: Array<string>, rowsCount: Array<number> }>({ placeholder: [], fileNames: [], rowsCount: [] })
  const [submitFinished, setSubmitFinished] = useState({
    total: 0,
    finished: 0
  })
  const findPlaceholder = () => {
    setTimes(0)
    setSubmitFinished({ ...submitFinished, total: 0, finished: 0 })
    const textArea = document.querySelectorAll(".comfy-multiline-input")

    const res: Array<string> = []
    uploadedText.el = []
    textArea.forEach((el) => {
      if (el.tagName === "TEXTAREA") {
        //@ts-ignore
        const matchedPlaceholders = (el as HTMLTextAreaElement).value.matchAll(/{(.*?)}/g)

        for (const item of matchedPlaceholders) {
          if (res.indexOf(item[1]) === -1) {
            res.push((item[1] as string))
            uploadedText.el.push(el as HTMLTextAreaElement)
          }
        };

        // setFormatter({placeholder:res})
      }
    })


    setFormatter({ placeholder: res, fileNames: new Array(res.length).fill(""), rowsCount: new Array(res.length).fill(0) })
    uploadedText.original = new Array(res.length).fill("")
    uploadedText.rows = new Array(res.length).fill([])
  }

  const upload = (index: number) => {
    const handleFileChange = (e: any) => {
      let file = e.target.files[0]
      const filename = file.name
      let fileReader = new FileReader();
      try {
        fileReader.readAsText(file);
        fileReader.onload = function () {
          const result = this.result
          if (typeof result !== "string") return


          uploadedText.original[index] = result
          const text = result.trim()

          const rows = text.split("\n")
          const removeEmptyRows = []
          for (let i = 0; i < rows.length; i++) {
            rows[i] = rows[i].replace("\n", "")
            rows[i] = rows[i].replace("\r", "")
            if (rows[i] === "") removeEmptyRows.push(i)
          }
          if (removeEmptyRows.length > 0) {
            for (let i = 0; i < removeEmptyRows.length; i++) rows.splice(removeEmptyRows[i] - i, 1)
          }

          uploadedText.rows[index] = rows
          const newFileNames = clone(formatter['fileNames'])
          newFileNames[index] = filename
          const newRowsCount = clone(formatter['rowsCount'])
          newRowsCount[index] = rows.length
          if (rows.length > times) setTimes(rows.length)

          setFormatter({ ...formatter, fileNames: newFileNames, rowsCount: newRowsCount })
        }
      } catch (e) {

      }
    }
    const temp_el = document.createElement("input")
    temp_el.addEventListener("change", handleFileChange, false);
    temp_el.type = "file"
    temp_el.accept = ".md,.csv,.txt"
    temp_el.click()
  }

  const submit = async () => {
    const promptButton: HTMLButtonElement | null = document.querySelector("#queue-button")
    if (!promptButton) return;
    //@ts-ignore
    promptButton.style="opacity:0.1;cursor:wait"
    const areaOriginalText = uploadedText.el.map((el) => el.value)
    setSubmitFinished({ ...submitFinished, total: times })
    for (let i = 0; i < times; i++) {
      for (let j = 0; j < uploadedText.el.length; j++) {
        const el = uploadedText.el[j]
        if (uploadedText.rows[j].length === 0) continue
        el.value = el.value.replace("{" + formatter['placeholder'][j] + "}", i >= uploadedText.rows[j].length ? uploadedText.rows[j][i % uploadedText.rows[j].length] : uploadedText.rows[j][i])
      }
      // console.log("times",i)
      // for(const item of uploadedText.el){
      //   console.log(item.value)
      // }
      promptButton.click()
      await new Promise(resolve => setTimeout(resolve, lag))
      for (let j = 0; j < uploadedText.el.length; j++) {
        uploadedText.el[j].value = areaOriginalText[j]
      }
      setSubmitFinished({ finished: i + 1, total: times })
    }
    //@ts-ignore
    promptButton.style="opacity:1; cursor:pointer"
  }
  return (<div style={{ backgroundColor: 'rgba(0,0,0,0.5)', minHeight: "100px", maxHeight: "40vh", overflowY: "scroll", width: "300px", border: "1px solid rgb(40,120,80)", padding: "8px", margin: "1px", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "center", opacity: mouseIn ? "0.8" : "0.2", borderRadius: "2px" }} onMouseEnter={() => setMouseIn(true)} onMouseLeave={() => setMouseIn(false)}>

    <div style={{ marginTop: "4px", display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%" }}><p> Submit Times:</p>
      <input value={times} onChange={(e) => setTimes(Number(e.target.value))}></input></div>
    <div style={{ marginTop: "1px", display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%" }}><p> Lag(ms):</p>
      <input value={lag} onChange={(e) => setLag(Number(e.target.value))}></input></div>
    <div style={{ margin: "4px", display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "80%", }}>
      <button onClick={findPlaceholder} style={{ border: "1px solid rgb(40,120,255)", backgroundColor: "rgb(20,20,40)", color: "white", borderRadius: "2px", cursor: "pointer" }}>Find Placeholder</button>
      <button style={{ border: "1px solid rgb(255,120,40)", backgroundColor: "rgb(20,20,40)", color: "white", borderRadius: "2px", cursor: "pointer" }} onClick={submit} >Submit!</button>
    </div>
    {submitFinished.total === 0 ? <></> : <div ><p>{submitFinished.finished}/{submitFinished.total}</p></div>}

    {formatter.placeholder.map((item, index) => (<div key={item} style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%" ,borderBottom:index===formatter.placeholder.length-1?"":"1px solid rgb(40,120,80)"}} >

      <p style={{ width: "20%", overflow: "hidden", textOverflow: "ellipsis" }}> {item}</p>
      <button onClick={() => upload(index)} style={{ border: "1px solid rgb(40,120,255)", backgroundColor: "rgb(20,20,40)", color: "white", borderRadius: "2px", cursor: "pointer", marginLeft: "4px" }}>upload</button>

      <div style={{ flex: "1", overflow: "hidden", textOverflow: "ellipsis", display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", marginLeft: "4px" }}>
        <div>rows:{formatter.rowsCount[index]}</div>
        <div style={{ marginLeft: "10px", width: "100%", overflow: "hidden", textOverflow: "ellipsis" }}>
          {formatter.fileNames[index]}</div>
      </div></div>))}

  </div>)
}


const init = () => {
  const promptButton: HTMLButtonElement | null = document.querySelector("#queue-button")
  if (!promptButton) return;
  const appContainer = document.createElement("div");
  appContainer.id = "formatter_app";
  document.body.appendChild(appContainer);

  appContainer.style.position = 'fixed';
  appContainer.style.top = "0px";
  appContainer.style.left = "0px";
  appContainer.style.zIndex = '1000';

  const root = createRoot(appContainer);
  const App = () => {
    const [show, setShow] = useState(false)
    const [dragging, setDragging] = useState(false)
    const handleMouseDown = (e: any) => {
      setDragging(true)
    }
    const handleMouseUp = (e: any) => {
      setDragging(false)
      const el: HTMLElement | null = document.querySelector("#formatter_app")
      if (!el) return;
      el.style.top = e.clientY + "px"
      el.style.left = e.clientX + "px"

    }
    const handleMouseMove = (e: any) => {
      const el: HTMLElement | null = document.querySelector("#formatter_app")
      if (!el) return;
      el.style.top = e.clientY + "px"
      el.style.left = e.clientX + "px"

    }


    return (<div >
      <div style={{ display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
        <button style={{ backgroundColor: "rgba(0,0,0,0)", padding: "0px", paddingTop: "2px", border: "none", cursor: "move" }} onMouseDown={handleMouseDown}><DragImage></DragImage> </button>
        <button style={{ border: `${show ? '1px solid rgb(40,120,80)' : '1px solid rgb(40,120,255)'}`, backgroundColor: "rgb(20,20,40)", color: "white", borderRadius: "2px", cursor: "pointer" }} onClick={() => setShow(!show)}>{show ? 'Hide' : 'Formatter'}</button></div>

      <div onMouseUp={handleMouseUp} onMouseMove={handleMouseMove} style={{ backgroundColor: 'rgba(0,0,0,0.2)', position: "fixed", top: "0px", left: "0px", width: "100%", height: "100%", display: dragging ? "block" : "none" }}></div>
      <div style={{ display: show && dragging === false ? "block" : "none" }}><DetailedAppContainer ></DetailedAppContainer></div>
    </div>)
  }

  root.render(
    <React.StrictMode>
      <App></App>
    </React.StrictMode>
  );

}

init()



chrome.runtime.onMessage.addListener(function (msg: PopoutMessage, sender, sendResponse) {
  if (msg.type === "Command" && msg.content === "isComfyUI") {
    const promptButton: HTMLButtonElement | null = document.querySelector("#queue-button")
    if (!promptButton) {
      const response: ResponseMessage = {
        response: false
      }
      sendResponse(response)
      return
    }
    const response: ResponseMessage = {
      response: true
    }
    sendResponse(response)
  }

});

