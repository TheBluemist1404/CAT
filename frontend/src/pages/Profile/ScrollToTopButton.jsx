import { useState, useEffect } from "react";

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [bounce, setBounce] = useState(0);

  
  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 200);
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  
  useEffect(() => {
    if (isVisible) {
      const interval = setInterval(() => {
        setBounce((prev) => (prev === 0 ? -5 : 0));
      }, 500);

      return () => clearInterval(interval);
    }
  }, [isVisible]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    isVisible && (
      <button
        onClick={scrollToTop}
        style={{
          position: "fixed",
          bottom: "100px",
          right: "20px",
          background: "#ffffff",
          border: "none",
          padding: "10px",
          borderRadius: "50%",
          cursor: "pointer",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          transform: `translateY(${bounce}px)`,
          transition: "transform 0.3s ease-in-out",
          zIndex:1000,
        }}
      >
        <img
          src="/src/assets/up.svg"
          alt="Scroll to top"
          width={30}
          height={30}
          style={{ display: "block" }}
        />
      </button>
    )
  );
};

export default ScrollToTopButton;
