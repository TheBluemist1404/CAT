import React, { useEffect, useState, useRef } from "react";

const PlaneAnimation = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const sectionRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const section = sectionRef.current;
      if (section) {
        const { top, height } = section.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // Calculate progress only when the section is visible
        if (top <= (windowHeight - 500) && top + height >= 0) {
          const progress = Math.min(Math.max(((windowHeight - 500) - top) / (height + (windowHeight - 500)), 0), 1);
          setScrollProgress(progress);
        } else {
          setScrollProgress(0); // Reset when out of view
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div>
      {/* Spacer to simulate page content */}
      {/* <div style={{ height: "150vh", background: "#f0f0f0", color: "black"}}>
        Scroll to see the animation
      </div> */}

      {/* Section with the animation */}
      <div
        ref={sectionRef}
        style={{
          position: "absolute",
          transform: 'translate(-50%,-85%)'
        }}
      >
        <svg width="506" height="1632" viewBox="30 -20 506 1632" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ position: 'relative', left: '50%' }}>
          <path id='curvePath' d="M44.4994 0.50107C1080 299.501 47 586.5 44.5 796.5C42 1006.5 521.499 868.502 492 1141C462.5 1413.5 1.00001 1631.5 1.00001 1631.5" stroke="black" stroke-dasharray="10.1 10.1" />
          <PlaneIcon progress={scrollProgress} />
        </svg>
      </div>
    </div>
  );
};

const PlaneIcon = ({ progress }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [angle, setAngle] = useState(0)

  useEffect(() => {
    const path = document.getElementById("curvePath");
    const pathLength = path.getTotalLength();
    const point = path.getPointAtLength(progress * pathLength);

    setPosition({ x: point.x, y: point.y });

    function tangent(pos) {
      const head = path.getPointAtLength(pos - 1)
      const tail = path.getPointAtLength(pos + 1)
      const radian = Math.atan((tail.y - head.y) / (tail.x - head.x))
      const deg = radian * (180 / Math.PI) + 45
      return ((radian > 0) ? deg : 180 + deg)
    }

    setAngle(tangent(progress * pathLength))
  }, [progress]);

  console.log(angle)

  return (
    <g
      transform={`translate(${position.x - 20}, ${position.y - 70}) scale(0.1) rotate(${angle}, 300, 750)`}  // Offset for centering the icon
    >
      {/* Your plane SVG */}
      <svg
        fill="#000000"
        viewBox="0 0 56 56"
        xmlns="http://www.w3.org/2000/svg"// Ensures the plane faces the curve
      >
        <path d="M 32.7812 52.5508 C 34.4687 52.5508 35.6640 51.0977 36.5312 48.8477 L 51.8829 8.7461 C 52.3048 7.6680 52.5626 6.7070 52.5626 5.9102 C 52.5626 4.3867 51.6016 3.4492 50.0781 3.4492 C 49.2813 3.4492 48.3203 3.6836 47.2423 4.1055 L 6.9296 19.5508 C 4.9609 20.3008 3.4374 21.4961 3.4374 23.2070 C 3.4374 25.3633 5.0780 26.0899 7.3280 26.7695 L 20.0077 30.6133 C 21.4843 31.0821 22.3280 31.0352 23.3359 30.0977 L 49.0466 6.0742 C 49.3514 5.7930 49.7032 5.8399 49.9375 6.0508 C 50.1717 6.2852 50.1952 6.6367 49.9139 6.9414 L 25.9843 32.7461 C 25.0937 33.7070 24.9999 34.5039 25.4687 36.0742 L 29.1718 48.4492 C 29.8749 50.8164 30.6015 52.5508 32.7812 52.5508 Z"></path>
      </svg>
    </g>
  );
};

export default PlaneAnimation;
