import {useEffect, useRef, useState} from "react";
import prompts from "../prompts.json";
import useFocus from "../hooks/useFocus";
import {InputWrapper, TypeBoxWrapper} from "../styles/TypeBoxStyles";
import {WordsPerMinuteDisplay} from "./WordsPerMinuteDisplay";
import {TextPreview} from "./TextPreview";

export function TypeBox() {
    const [prompt, setPrompt] = useState(getRandomPrompt());
    const appendedTextRef = useRef("");
    const [startTime, setStartTime] = useState(undefined);
    const [isFinished, setIsFinished] = useState(false);
    const [inputRef, setInputFocus] = useFocus();
    const [isTyping, setIsTyping] = useState(false);

    const [typedText, setTypedText] = useState("");
    const [faultPresent, setFaultPresent] = useState(false);

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
        const currentText = e.target.value;

        const typedText = appendedTextRef.current + currentText;
        const faultPresent = !prompt.startsWith(typedText);
        const lastChar = typedText === prompt;

        if ((currentText.charAt(currentText.length -1) === " " && !faultPresent) || lastChar ) {
            appendedTextRef.current = typedText;
            e.target.value = "";
        }
        setIsFinished(lastChar);
        setFaultPresent(faultPresent);
        setTypedText(typedText);
    }

    function resetCurrent() {
        setIsFinished(false);
        setStartTime(undefined);
        appendedTextRef.current = "";
        const newPrompt = getRandomPrompt();
        setPrompt(newPrompt);
        setTypedText("");
        setInputFocus();
        inputRef.current.value = "";
    }

    return (
    <TypeBoxWrapper>
        <TextPreview prompt={prompt} typedText={typedText} isTyping={isTyping}  />

        <WordsPerMinuteDisplay startTime={startTime} isFinished={isFinished} appendedTextRef={appendedTextRef} />
        <InputWrapper faultPresent={faultPresent}>
            <input ref={inputRef} autoFocus={true} readOnly={isFinished} onChange={handleCharInput} />
            <button onClick={resetCurrent}>{isFinished ? "Again" : "Refresh"}</button>
        </InputWrapper>
    </TypeBoxWrapper>);
}

function getRandomPrompt() {
    return prompts[Math.floor(Math.random() * prompts.length)];
}