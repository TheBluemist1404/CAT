import {useState, useEffect, useRef} from 'react';
import './typing_effect.css';


function TypingEffect({text, decor, loop, speed=100, delay=500}) {
    const containerRef = useRef();
    const [displayText, setDisplayText] = useState("");
    const [index, setIndex] = useState(0);
    const [typeForward, setTypeForward] = useState(true)

    useEffect(() => {
        if (decor) {
            containerRef.current.classList.add("typing-container")
        }
    })

    useEffect(()=>{
        const type = () =>{
            if (typeForward) {
                if (index<text.length) {
                    setDisplayText(text.slice(0, index+1));
                    setIndex(index+1);
                } 
                // else {
                //     setTypeForward(false);
                //     setTimeout(()=> setIndex(index-1), delay);
                // }
            } else{
                if (loop) {
                    if (index>=0) {
                        setDisplayText(text.slice(0, index));
                        setIndex(index-1);
                    } else {
                        setTypeForward(true);
                        setTimeout(()=> setIndex(index+1), delay)
                    }
                }
            }
        }
        const timeout = setTimeout(type, speed);
        return () => clearTimeout(timeout);
    }, [text, speed, delay, displayText, index]) 


    return(
        <span ref={containerRef}>
            <span>{displayText}</span>{loop && <span className="typing-cursor">|</span>}
        </span>
    )

}

export default TypingEffect