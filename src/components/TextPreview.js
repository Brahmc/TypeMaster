import {CurrentLetter, TextPreviewWrapper} from "../styles/TypeBoxStyles";

export function TextPreview({prompt, typedText, isTyping}) {

    const faultIndex = typedText.split('').findIndex((c, idx) => prompt[idx] !== c);
    const wrongText = faultIndex === -1 ? "" : prompt.substring(faultIndex, typedText.length);
    const rightText = prompt.substring(0, Math.min(typedText.length, prompt.length) - wrongText.length);
    const remainingText = prompt.substring(rightText.length + wrongText.length);

    return (
        <TextPreviewWrapper>
            <span style={{color: "#d7d6cd"}} >{rightText}</span>
            <span style={{backgroundColor: "#f942427a"}}>{wrongText}</span>
            <CurrentLetter isTyping={isTyping}>{remainingText.substring(0, 1)}</CurrentLetter>
            <span>{remainingText.substring(1)}</span>
        </TextPreviewWrapper>
    );
}