import {WordsPerMinuteDisplayWrapper} from "../styles/TypeBoxStyles";
import {useEffect, useState} from "react";

export function WordsPerMinuteDisplay({startTime, isFinished, appendedTextRef}) {
    const [wordsPerMinute, setWordsPerMinute] = useState(NaN);

    useEffect(() => {
        const setWpm = () => setWordsPerMinute( ( (appendedTextRef.current ? appendedTextRef.current.split(" ").length : 0) / ( (Date.now() - startTime) / (60 * 1000) ) ));
        if (!startTime || isFinished) return setWpm();
        const interval = setInterval(setWpm, 700);
        return () => clearInterval(interval);
    }, [appendedTextRef, startTime, isFinished]);

    return (
        <WordsPerMinuteDisplayWrapper>
            {isFinished ? "Complete! - " : ""}{isNaN(wordsPerMinute) ? "-" : wordsPerMinute.toFixed(2)} wpm
        </WordsPerMinuteDisplayWrapper>
    );
}