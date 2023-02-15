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
            <span style={{color: "#60ff60"}}>{rightText}</span>
            <span style={{backgroundColor: "rgb(231 78 78 / 67%)"}}>{wrongText}</span>
            <span style={{boxShadow: "-1px 0 0 grey"}}>{remainingText.substring(0, 1)}</span>
            <span>{remainingText.substring(1)}</span>
        </div>

        <div style={{color: "#e2b714"}}>{isFinished ? "Complete! - " : ""}{wordsPerMinute.toFixed(2)} WPM</div>
        <input value={currentText} type="text" onChange={e => {
            if (isFinished) return;
            setCurrentText(e.target.value);
            if (!startTime) setStartTime(Date.now());
            if (appendedText + e.target.value === prompt) setIsFinished(true);
        }} />
        <button onClick={() => {
            setIsFinished(false);
            setStartTime(undefined);
            setAppendedText("");
            setPrompt(getRandomPrompt())
        }}>Again</button>
    </div>);
}

function getRandomPrompt() {
    return prompts[Math.floor(Math.random() * prompts.length)];
}