import styled from 'styled-components';

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
  animation: ${props => props.isTyping ? null : 'Cursor-Blink 1s infinite linear'};
  box-shadow: -2px 0 0 #e2b714;

  @keyframes Cursor-Blink {
      0% { box-shadow: -2px 0 0 #e2b714 }
      49% { box-shadow: -2px 0 0 #e2b714 }
      50% { box-shadow: none }
      100% { box-shadow: none }
  }
`;
