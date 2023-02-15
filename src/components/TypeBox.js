import {useEffect, useState} from "react";

export function TypeBox() {
    const [text] = useState("A test.");
    const [appendedText, setAppendedText] = useState("");
    const [currentText, setCurrentText] = useState("");
    const [startTime, setStartTime] = useState(undefined);
    const [wordsPerMinute, setWordsPerMinute] = useState(0);
    const [isFinished, setIsFinished] = useState(false);

    const typedText = appendedText + currentText;
    const faultIndex = typedText.split('').findIndex((c, idx) => text[idx] !== c);
    const wrongText = faultIndex === -1 ? "" : text.substring(faultIndex, typedText.length);
    const rightText = typedText.substring(typedText.length - wrongText.length, 0);
    const remainingText = text.substring(rightText.length + wrongText.length);


    if (( (currentText.charAt(currentText.length -1) === " " && !wrongText) || typedText === text ) && appendedText !== text) {
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
            setCurrentText(e.target.value);
            if (!startTime) setStartTime(Date.now());
            if (appendedText + e.target.value === text) setIsFinished(true);
        }} />
    </div>);
}