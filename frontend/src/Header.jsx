import { useState, useRef, useEffect } from "react";

function Header(){
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const linkRefs = useRef([])

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

    const navbar = ["About", "Forum","Live Code", "Contact"];

    return(
        <div className="header"> 
            <img src="/src/assets/logo.svg" alt="" />
            <div className="navbar">
                {navbar.map((sect, index) => (
                    <div ref={el => linkRefs.current[index] = el}
                     onMouseEnter={() => setHoveredIndex(index)} 
                     onMouseLeave={() => setHoveredIndex(null)}>
                        {sect}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Header;