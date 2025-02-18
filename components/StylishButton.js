import React from "react";
import { Button } from "@mui/material";
import { useTheme } from "../context/themeContext"; // Adjust the path as needed

const StylishButton = ({ onClick, children }) => {
  const { theme } = useTheme(); // Access the current theme from the custom ThemeContext

  const styles = {
    light: {
      backgroundColor: "#fff",
      color: "#2F2F2F",
      hoverBackground: "#000",
      hoverColor: "#fff",
    },
    dark: {
      backgroundColor: "#2F2F2F",
      color: "#fff",
      hoverBackground: "lightgray",
      hoverColor: "#000",
    },
  };

  const currentStyle = styles[theme]; // Get the styles for the current theme

  return (
    <Button
      sx={{
        backgroundColor: currentStyle.backgroundColor,
        padding: "8px",
        height: "32px",
        fontSize: "14px",
        fontWeight: "bold",
        color: currentStyle.color,
        "&:hover": {
          backgroundColor: currentStyle.hoverBackground,
          color: currentStyle.hoverColor,
        },
      }}
      onClick={onClick}
    >
      {children}
    </Button>
  );
};

export default StylishButton;
