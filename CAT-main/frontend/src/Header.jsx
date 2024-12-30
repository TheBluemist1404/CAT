import { useState, useRef, useEffect} from "react";
import { useNavigate } from "react-router-dom";

function Header(){
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const linkRefs = useRef([])

    const naviagte = useNavigate();
    
    useEffect(() => { 
        linkRefs.current.forEach((link, index) => { 
            if (link) { 
                if (hoveredIndex === index) { 
                    link.style.textDecorationColor = 'white';
                    link.style.textUnderlineOffset = '20px';
                    link.style.textDecorationThickness = '2px'; 
                } else { 
                    link.style.textDecorationColor = 'transparent'; 
                    link.style.textUnderlineOffset = '0px';
                    link.style.textDecorationThickness = '0'; 
                } 
            } 
        }); 
    },[hoveredIndex]);

    const navbar = [{sect: "About", link: "/"}, {sect: "Forum", link: "/forum"},{sect: "Live Code", link: "/"}];

    return(
        <div className="header"> 
            <img src="/src/assets/logo.svg" alt="" onClick={()=>naviagte('/')} style={{cursor: 'pointer'}}/>
            <div className="navbar">
                {navbar.map((obj, index) => (
                    <div ref={el => linkRefs.current[index] = el}
                     onMouseEnter={() => setHoveredIndex(index)} 
                     onMouseLeave={() => setHoveredIndex(null)}
                     onClick={() => naviagte(obj.link)}>
                        {obj.sect}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Header;