import React, { useState } from "react";

const ThemeToggleButton = ({ onToggle }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleToggle = () => {
    setIsDarkMode(!isDarkMode);
    if (onToggle) {
      onToggle(!isDarkMode); // Notify parent about the toggle
    }
  };

  return (
    <div
      onClick={handleToggle}
      className={`relative w-14 h-7 mt-2 mr-2 flex items-center rounded-full p-1 cursor-pointer ${
        isDarkMode ? "bg-gray-200" : "bg-gray-300"
      }`}
    >
      {/* Circle */}
      <div
        className={`w-6 h-6 rounded-full transform transition-transform duration-300 ${
          isDarkMode ? "translate-x-6 bg-gray-600" : "translate-x-0 bg-gray-600"
        }`}
      ></div>

      {/* Icon Overlay */}
      {isDarkMode ? (
        <span className="absolute right-2 text-gray-950 text-xs">
          🌙
        </span>
      ) : (
        <span className="absolute left-2 text-gray-600 text-xs">☀️</span>
      )}
    </div>
  );
};

export default ThemeToggleButton;
