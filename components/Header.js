import React, { useState, useEffect } from "react";
import Logout from "./Logout";
import { useRouter } from "next/router";
import SettingsIcon from "@mui/icons-material/Settings";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ThemeToggleButton from "../components/ThemeToggle"; // Import the custom toggle button
import { useTheme } from "../context/themeContext"; // Ensure this imports your theme context


const Header = () => {
  const router = useRouter();
  const [username, setUsername] = useState(""); // State to hold the username
  const { theme, toggleTheme } = useTheme(); // Access theme and toggle function

  useEffect(() => {
    // Retrieve username from localStorage
    const storedUsername = localStorage.getItem("user");
    if (storedUsername) {
      setUsername(storedUsername); // Set the username in state
    }
  }, []); // Run only on component mount

  const handleSettingsClick = () => {
    router.push("/admin/settings");
  };

  function toCamelCase(pathname) {
    return pathname
      .split("/") 
      .filter(Boolean) 
      .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1)) 
      .join("/ "); 
  }

  function getLastSegment(pathname) {
    const segments = pathname.split("/").filter(Boolean);
    const lastSegment = segments[segments.length - 1];

    if (lastSegment === "admin") {
      return "Home";
    }

    return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);
  }
  const headerBgColor = theme === "light" ? "#FFFF" : "#333";  // White for light, dark for dark mode
  const headerTextColor = theme === "light" ? "#000" : "#fff";

  return (
    <div
      style={{
        backgroundColor: headerBgColor,
        color: headerTextColor,
      }}
    >
    <header className="h-[60px] flex justify-between items-center mt-6 rounded-xl px-4 mr-3 z-50">
      <span className="text-gray-950 text-3xl">
        <p className={`text-xl ${
                  theme === "dark" ? "text-white" : "text-gray-950"
                }`}>
          {toCamelCase(router?.pathname?.replace("/admin", "Dashboard "))}
        </p>
        <h1 className={`text-2xl font-bold mt-2 ${
                  theme === "dark" ? "text-white" : "text-gray-950"
                }`}>
          {getLastSegment(router?.pathname)}
        </h1>
      </span>

      <div className="flex items-center space-x-2">
         {/* Theme Toggle Button */}
         <ThemeToggleButton
            onToggle={() => {
              toggleTheme(); // Call your context toggle function
            }}
          />
        <AccountCircleIcon fontSize="large" className={`text-gray-500 mt-1 ${
                  theme === "dark" ? "text-white" : "text-gray-950"
                }`} />
        
        {/* Display the username dynamically */}
        <span className={`text-xl mt-2 text-gray-700 ${
                  theme === "dark" ? "text-white" : "text-gray-950"
                }`}>
          { username == undefined && username ? username : "Admin"}
        </span>

        <div className="flex items-center justify-center ">
          <Logout />
        </div>

        {/* Add the settings icon next to logout */}
        <div
            className="cursor-pointer p-2 rounded-md transition-colors duration-200"
            onClick={handleSettingsClick}
            style={{
              backgroundColor: theme.hoverBackground, // Dynamic hover background
              color: theme.text, // Dynamic text color
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = theme.hoverBackground;
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "transparent";
            }}
          >
            <SettingsIcon
              fontSize="large"
              style={{
                color: theme.text, // Dynamic icon color
              }}
            />
          </div>
      </div>
    </header>
    </div>
  );
};

export default Header;
