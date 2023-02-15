import {useEffect, useState} from "react";
import prompts from "../prompts.json";

export function TypeBox() {
    const [prompt, setPrompt] = useState(getRandomPrompt());
    const [appendedText, setAppendedText] = useState("");
    const [currentText, setCurrentText] = useState("");
    const [startTime, setStartTime] = useState(undefined);
    const [wordsPerMinute, setWordsPerMinute] = useState(0);
    const [isFinished, setIsFinished] = useState(false);

    const typedText = appendedText + currentText;
    const faultIndex = typedText.split('').findIndex((c, idx) => prompt[idx] !== c);
    const wrongText = faultIndex === -1 ? "" : prompt.substring(faultIndex, typedText.length);
    const rightText = typedText.substring(typedText.length - wrongText.length, 0);
    const remainingText = prompt.substring(rightText.length + wrongText.length);


    if (( (currentText.charAt(currentText.length -1) === " " && !wrongText) || typedText === prompt ) && appendedText !== prompt) {
        setAppendedText(appendedText + currentText);
        setCurrentText("");
    }

    useEffect(() => {
        const setWpm = () => setWordsPerMinute( ( (appendedText || undefined)?.split(" ").length / ( (Date.now() - startTime) / (60 * 1000) ) ) || 0 );

        if (!startTime || isFinished) return setWpm();
        const interval = setInterval(() => {
            setWpm();
        }, 600);
        return () => clearInterval(interval);
    }, [appendedText, isFinished, startTime]);

    return (<div style={{maxWidth: 1000, margin: "auto", padding: 50}}>
        <div style={{marginBottom: "30px"}}>
            <span >{rightText}</span>
            <span style={{backgroundColor: "rgb(249 66 66 / 48%)", color: "grey"}}>{wrongText}</span>
            <span style={{boxShadow: "-1px 0 0 grey", color: "grey"}}>{remainingText.substring(0, 1)}</span>
            <span style={{color: "grey"}}>{remainingText.substring(1)}</span>
        </div>

        <div style={{color: "#e2b714", textAlign: "right", marginBottom: "5px"}}>{isFinished ? "Complete! - " : ""}{wordsPerMinute.toFixed(2)} wpm</div>
        <div style={{whiteSpace: "nowrap", display: "flex", flexDirection: "row"}}>
            <input style={{width: "100%", height: "27px", fontSize: "1rem", color: "#323437", borderStyle: "solid none solid solid", border: "2px #e2b714", borderRadius: "10px 0 0 10px", outline: "none", padding: "0 10px"}} value={currentText} type="text" onChange={e => {
                if (isFinished) return;
                setCurrentText(e.target.value);
                if (!startTime) setStartTime(Date.now());
                if (appendedText + e.target.value === prompt) setIsFinished(true);
            }} />
            <button style={{height: "27px", borderRadius: "0 10px 10px 0", border: "none", backgroundColor: "#e2b714", color: "#323437"}} onClick={() => {
                setIsFinished(false);
                setStartTime(undefined);
                setAppendedText("");
                setPrompt(getRandomPrompt())
            }}>Again</button>
        </div>
    </div>);
}

function getRandomPrompt() {
    return prompts[Math.floor(Math.random() * prompts.length)];
}