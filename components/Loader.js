import { Puff } from "react-loader-spinner";
import React, { useState, useEffect } from "react";

export default () => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 1050);
    };

    // Set initial state based on the current window width
    handleResize();

    // Add event listener to track window resizing
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      style={{
        width: isSmallScreen ? "150vw" : "100vw", // Conditional width
        height: "100vh",
        position: "absolute",
        top: "0px",
        left: "0px",
        zIndex: 111111,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        backgroundColor: "rgba(255, 255, 255, 0.6)", // Semi-transparent white
        backdropFilter: "blur(2px)", // Apply blur effect
      }}
    >
      <Puff
        height={120}
        width={120}
        color="#2F2F2F" // Filled circles color
        ariaLabel="puff-loading"
        visible={true}
      />
      <p style={{ color: "#2F2F2F", marginTop: "20px", fontSize: "1.2rem" }}>
        Loading, please wait...
      </p>
    </div>
  );
};
