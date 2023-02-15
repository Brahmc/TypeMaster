import {useEffect, useState} from "react";
import prompts from "../texts.json";

export function TypeBox() {
    const [prompt, setPrompt] = useState(getPrompt());
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

    return (<div style={{fontSize: "1.5rem", fontWeight: "bold"}}>
        <span style={{color: "green"}}>{rightText}</span>
        <span style={{color: "red"}}>{wrongText}</span>
        <span>{remainingText}</span>
        <div>{wordsPerMinute.toFixed(2)} WPM</div>
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
            setPrompt(getPrompt())
        }}>Again</button>
    </div>);
}

function getPrompt() {
    return prompts[Math.floor(Math.random() * prompts.length)];
}