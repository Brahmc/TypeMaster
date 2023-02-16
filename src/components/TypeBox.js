import {useEffect, useState} from "react";
import prompts from "../prompts.json";
import useFocus from "../hooks/useFocus";
import {CurrentLetter, InputWrapper} from "../styles/TypeBoxStyles";

export function TypeBox() {
    const [prompt, setPrompt] = useState(getRandomPrompt());
    const [appendedText, setAppendedText] = useState("");
    const [startTime, setStartTime] = useState(undefined);
    const [wordsPerMinute, setWordsPerMinute] = useState(NaN);
    const [isFinished, setIsFinished] = useState(false);
    const [inputRef, setInputFocus] = useFocus();
    const [isTyping, setIsTyping] = useState(false);

    const [[wrongText, rightText, remainingText], setValues] = useState(["", "", prompt]);

    useEffect(() => {
        const setWpm = () => setWordsPerMinute( ( (appendedText ? appendedText.split(" ").length : 0) / ( (Date.now() - startTime) / (60 * 1000) ) ));

        if (!startTime || isFinished) return setWpm();
        const interval = setInterval(() => {
            setWpm();
        }, 600);
        return () => clearInterval(interval);
    }, [appendedText, isFinished, startTime]);
    
    useEffect(() => {
        if (!isTyping) return;
        setTimeout(() => {
            setIsTyping(false);
        }, 500);
    },[isTyping]);

    return (<div style={{maxWidth: 1000, margin: "auto", padding: 50}}>
        <div style={{marginBottom: "30px"}}>
            <span >{rightText}</span>
            <span style={{backgroundColor: "rgb(249 66 66 / 48%)", color: "grey"}}>{wrongText}</span>
            <CurrentLetter isTyping={isTyping} style={{ color: "grey"}}>{remainingText.substring(0, 1)}</CurrentLetter>
            <span style={{color: "grey"}}>{remainingText.substring(1)}</span>
        </div>

        <div style={{color: "#e2b714", textAlign: "right", marginBottom: "5px"}}>{isFinished ? "Complete! - " : ""}{isNaN(wordsPerMinute) ? "-" : wordsPerMinute.toFixed(2)} wpm</div>
        <InputWrapper>
            <input ref={inputRef} type="text" autoFocus={true} readOnly={isFinished} onChange={e => {
                if (isFinished) {
                    e.target.value = "";
                    return;
                }
                setIsTyping(true);
                if (!startTime) setStartTime(Date.now());
                if (appendedText + e.target.value === prompt) setIsFinished(true);

                const currentText = e.target.value;

                const typedText = appendedText + currentText;
                const faultIndex = typedText.split('').findIndex((c, idx) => prompt[idx] !== c);
                const wrongText = faultIndex === -1 ? "" : prompt.substring(faultIndex, typedText.length);
                const rightText = typedText.substring(typedText.length - wrongText.length, 0);
                const remainingText = prompt.substring(rightText.length + wrongText.length);

                if ((currentText.charAt(currentText.length -1) === " " && !wrongText) || typedText === prompt ) {
                    setAppendedText(typedText);
                    e.target.value = "";
                }
                setValues([wrongText, rightText, remainingText]);
            }} />
            <button onClick={() => {
                setIsFinished(false);
                setStartTime(undefined);
                setAppendedText("");
                const newPrompt = getRandomPrompt();
                setPrompt(newPrompt);
                setValues(["", "", newPrompt]);
                setInputFocus();
                inputRef.current.value = "";
            }}>{isFinished ? "Again" : "Refresh"}</button>
        </InputWrapper>
    </div>);
}

function getRandomPrompt() {
    return prompts[Math.floor(Math.random() * prompts.length)];
}