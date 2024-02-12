import { useState, useEffect } from 'react';
import './styles/rules-modal.css'
const useTypewriter = (text, speed = 50) => {
  const [displayText, setDisplayText] = useState('');
  let i = 0;
  useEffect(() => {
    const typingInterval = setInterval(() => {
      if (i < text.length) {
        console.log(text.charAt(i))
        setDisplayText(prevText => prevText + text[i]);
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, speed);

    return () => {
      clearInterval(typingInterval);
    };
  }, [text, speed]);

  return displayText;
};
const Typewriter = ({ text, speed, tag }) => {
  const displayText = useTypewriter(text, speed);
  const [cursorDisplayed, setCursorDisplayed] = useState(true)
  useEffect(() => {
    setTimeout(() => {
      setCursorDisplayed(false)
    }, speed * text.length + 200)
  })
  if (tag == 'p') {
    return (

      <div class="typing-container">
        <p>{displayText}</p>
        {cursorDisplayed ? <span class="input-cursor"></span> : <span></span>}
      </div>
    )
  } else if (tag == 'h1') {
    return (
      <div class="typing-container">
        <h1>{displayText}</h1>
        {cursorDisplayed ? <span class="input-cursor"></span> : <span></span>}
      </div>
    )
  }
  else if (tag == 'h2') {
    return (
      <div class="typing-container">
        <h2>{displayText}</h2>
        {cursorDisplayed ? <span class="input-cursor"></span> : <span></span>}
      </div>
    )
  }
  else if (tag == 'h3') {
    return (
      <div class="typing-container">
        <h3>{displayText}</h3>
        {cursorDisplayed ? <span class="input-cursor"></span> : <span></span>}
      </div>
    )
  }
  else if (tag == 'h4') {
    return (
      <div class="typing-container">
        <h4>{displayText}</h4>
        {cursorDisplayed ? <span class="input-cursor"></span> : <span></span>}
      </div>
    )
  }
  

};


export default Typewriter;