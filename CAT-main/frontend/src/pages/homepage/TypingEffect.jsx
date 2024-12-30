import {useState, useEffect} from 'react';
import './typing_effect.css';


function TypingEffect({text, speed=100, delay=500}) {
    const [displayText, setDisplayText] = useState("");
    const [index, setIndex] = useState(0);
    const [typeForward, setTypeForward] = useState(true)

    useEffect(()=>{
        const type = () =>{
            if (typeForward) {
                if (index<text.length) {
                    setDisplayText(text.slice(0, index+1));
                    setIndex(index+1);
                } else {
                    setTypeForward(false);
                    setTimeout(()=> setIndex(index-1), delay);
                }
            } else{
                if (index>=0) {
                    setDisplayText(text.slice(0, index));
                    setIndex(index-1);
                } else {
                    setTypeForward(true);
                    setTimeout(()=> setIndex(index+1), delay)
                }
            }
        }
        const timeout = setTimeout(type, speed);
        return () => clearTimeout(timeout);
    }, [text, speed, delay, displayText, index]) 


    return(
        <div className='typing-container'>
            <span>{displayText}</span><span className="typing-cursor">|</span>
        </div>
    )

}

export default TypingEffect