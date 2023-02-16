import {useEffect, useRef, useState} from "react";
import prompts from "../prompts.json";
import useFocus from "../hooks/useFocus";
import {CurrentLetter, InputWrapper, TextPreview, TypeBoxWrapper, WordsPerMinuteDisplay} from "../styles/TypeBoxStyles";

export function TypeBox() {
    const [prompt, setPrompt] = useState(getRandomPrompt());
    const appendedTextRef = useRef("");
    const [startTime, setStartTime] = useState(undefined);
    const [wordsPerMinute, setWordsPerMinute] = useState(NaN);
    const [isFinished, setIsFinished] = useState(false);
    const [inputRef, setInputFocus] = useFocus();
    const [isTyping, setIsTyping] = useState(false);

    const [[wrongText, rightText, remainingText], setValues] = useState(["", "", prompt]);

    useEffect(() => {
        if (!startTime || isFinished) return;
        const setWpm = () => setWordsPerMinute( ( (appendedTextRef.current ? appendedTextRef.current.split(" ").length : 0) / ( (Date.now() - startTime) / (60 * 1000) ) ));
        const interval = setInterval(setWpm, 700);
        return () => {clearInterval(interval); setWpm();};
    }, [appendedTextRef, startTime, isFinished]);

    useEffect(() => {
        if (!isTyping) return;
        setTimeout(() => {
            setIsTyping(false);
        }, 400);
    },[isTyping]);

    function handleCharInput(e) {
        if (isFinished) return;
        setIsTyping(true);
        if (!startTime) setStartTime(Date.now());
        if (appendedTextRef.current + e.target.value === prompt) setIsFinished(true);

        const currentText = e.target.value;

        const typedText = appendedTextRef.current + currentText;
        const faultIndex = typedText.split('').findIndex((c, idx) => prompt[idx] !== c);
        const wrongText = faultIndex === -1 ? "" : prompt.substring(faultIndex, typedText.length);
        const rightText = prompt.substring(0, Math.min(typedText.length, prompt.length) - wrongText.length);
        const remainingText = prompt.substring(rightText.length + wrongText.length);

        if ((currentText.charAt(currentText.length -1) === " " && !wrongText) || typedText === prompt ) {
            appendedTextRef.current = typedText;
            e.target.value = "";
        }
        setValues([wrongText, rightText, remainingText]);
    }

    function resetCurrent() {
        setIsFinished(false);
        setStartTime(undefined);
        appendedTextRef.current = "";
        const newPrompt = getRandomPrompt();
        setPrompt(newPrompt);
        setValues(["", "", newPrompt]);
        setInputFocus();
        inputRef.current.value = "";
    }

    return (
    <TypeBoxWrapper>
        <TextPreview>
            <span style={{color: "white"}} >{rightText}</span>
            <span style={{backgroundColor: "#f942427a"}}>{wrongText}</span>
            <CurrentLetter isTyping={isTyping}>{remainingText.substring(0, 1)}</CurrentLetter>
            <span>{remainingText.substring(1)}</span>
        </TextPreview>

        <WordsPerMinuteDisplay>
            {isFinished ? "Complete! - " : ""}{isNaN(wordsPerMinute) ? "-" : wordsPerMinute.toFixed(2)} wpm
        </WordsPerMinuteDisplay>
        <InputWrapper faultPresent={wrongText}>
            <input ref={inputRef} autoFocus={true} readOnly={isFinished} onChange={handleCharInput} />
            <button onClick={resetCurrent}>{isFinished ? "Again" : "Refresh"}</button>
        </InputWrapper>
    </TypeBoxWrapper>);
}

function getRandomPrompt() {
    return prompts[Math.floor(Math.random() * prompts.length)];
}