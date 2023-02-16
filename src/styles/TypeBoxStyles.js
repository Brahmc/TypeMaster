import styled from 'styled-components';

export const TypeBoxWrapper = styled.div`
  max-width: 1000px;
  margin: auto;
  padding: 50px;
`;

export const InputWrapper = styled.div`
  white-space: nowrap;
  display: flex;
  flex-direction: row;
  
  input {
    width: 100%;
    height: 27px;
    font-size: 1rem; 
    color: #323437;
    border-style: solid none solid solid;
    border: 2px #e2b714;
    border-radius: 10px 0 0 10px; 
    outline: none;
    padding: 0 10px;
    background-color: ${props => props.faultPresent ? "#ffc7c7" : "#d7d6cd"};
  }
  
  button {
    height: 27px;
    border-radius: 0 10px 10px 0;
    border: none;
    background-color: #e2b714;
    color: #323437;
  }
`;

export const CurrentLetter = styled.span`
  animation: ${props => props.isTyping ? null : 'Cursor-Blink 1.06s infinite linear'};
  box-shadow: -2px 0 0 #e2b714;

  @keyframes Cursor-Blink {
      0% { box-shadow: -2px 0 0 #e2b714 }
      49% { box-shadow: -2px 0 0 #e2b714 }
      50% { box-shadow: none }
      100% { box-shadow: none }
  }
`;

export const TextPreview = styled.div`
  color: grey;
  margin-bottom: 30px;
  user-select: none;
`;

export const WordsPerMinuteDisplay = styled.div`
  color: #e2b714;
  text-align: right;
  margin-bottom: 5px;
`;