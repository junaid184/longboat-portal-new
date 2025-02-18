import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import menuItems from "./MenuItems";
import { ImTicket } from "react-icons/im";
import { GiHamburgerMenu } from "react-icons/gi"; // Import the hamburger icon
import { useTheme } from "../context/themeContext"; // Use the theme context

export default function Sidebar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  const [sidebarHeight, setSidebarHeight] = useState("95vh");
  const { theme, toggleTheme } = useTheme(); // Get theme and toggle function

  // Function to handle screen width change based on media query
  const handleScreenChange = (e) => {
    if (e.matches) {
      setIsOpen(true); // Open sidebar if screen width is >640px
      setSidebarHeight("95vh"); // Set height for larger screens
    } else {
      setIsOpen(false); // Close sidebar on smaller screens
      setSidebarHeight("156vh"); // Set height for smaller screens
    }
  };

  useEffect(() => {
    // Set up media query listener
    const mediaQuery = window.matchMedia("(min-width: 640px)");

    // Initial sidebar state based on screen size
    setIsOpen(mediaQuery.matches);
    setSidebarHeight(mediaQuery.matches ? "95vh" : "156vh");

    // Attach listener for future screen width changes
    mediaQuery.addEventListener("change", handleScreenChange);

    // Cleanup listener on component unmount
    return () => mediaQuery.removeEventListener("change", handleScreenChange);
  }, []);

  const sidebarBgColor = theme === "light" ? "#333" : "#FFFF"; // White for light, dark for dark mode
  const sidebarTextColor = theme === "light" ? "#fff" : "#000";

  return (
    <div>
      <div
        style={{
          backgroundColor: sidebarBgColor,
          color: sidebarTextColor,
        }}
      >
        {/* Hamburger button visible only on smaller screens */}
        <button
          className="fixed top-16 right-6 z-60 sm:hidden p-2 rounded-full"
          onClick={() => setIsOpen((prev) => !prev)} // Toggle isOpen state
        >
          <GiHamburgerMenu className="text-gray-600" size={23} />
        </button>

        {/* Sidebar visibility based on isOpen state */}
        {isOpen && (
          <aside
            className="fixed top-0 left-0 w-[290px] shadow-2xl rounded-xl m-5 z-50"
            style={{
              backgroundColor: sidebarBgColor,
              borderStyle: "solid",
              overflowY: "auto",
              height: sidebarHeight, // Set height based on sidebarHeight state
            }}
          >
            <div className="flex flex-col items-center justify-center">
              <div className="flex py-2 sm:m-4 sm:py-2 sm:px-6">
                <ImTicket
                  className="w-7 h-7 mt-1 mr-3 text-gray-900"
                  style={{
                    backgroundColor: sidebarBgColor,
                    color: sidebarTextColor,
                  }}
                ></ImTicket>
                <h1
                  className="text-3xl text-center font-sans font-bold text-gray-900"
                  style={{
                    backgroundColor: sidebarBgColor, // Dynamic hover background
                    color: sidebarTextColor, // Dynamic text color
                  }}
                >
                  TM Portal
                </h1>
              </div>
            </div>
            <nav
              style={{
                backgroundColor: sidebarBgColor, // Dynamic hover background
                color: sidebarTextColor,
              }}
            >
              <ul>
                {menuItems["admin"].map(({ url, title, icon }, index) => (
                  <li
                    key={index}
                    className={`flex items-center ml-4 mr-4 justify-center sm:justify-start rounded transform transition-transform duration-300
                  ${router.pathname === url ? "bg-gray-300 text-black" : ""}
                  hover:bg-gray-200 hover:text-black`}
                  >
                    <Link
                      href={url}
                      className={`w-full flex items-center p-2 space-x-2 rounded cursor-pointer
                    ${
                      router.pathname === url
                        ? theme === "light"
                          ? "bg-gray-50 text-black"
                          : "bg-[#2F2F2F] text-white"
                        : theme === "light"
                        ? "hover:bg-gray-400 hover:text-white"
                        : "hover:bg-gray-300 hover:text-black"
                    }`}
                      onClick={() => {
                        if (window.innerWidth < 640) {
                          setIsOpen(false); // Close sidebar on smaller screens after link click
                        }
                      }}
                    >
                      <div className="flex items-center w-12 h-12">
                        <Image
                          src={icon}
                          alt="SideBar Icons"
                          width={18}
                          height={18}
                          className={`transition-all duration-200 ${
                            theme === "light"
                              ? router.pathname === url
                                ? "filter invert-0" // Black icon when active in light theme
                                : "filter invert group-hover:invert-0" // Black icon on hover in light theme
                              : router.pathname === url
                              ? "filter invert" // White icon when active in dark theme
                              : "filter invert-0 group-hover:invert" // White icon on hover in dark theme
                          }`}
                        />
                      </div>
                      <span className="sm:block font-medium text-xl">
                        {title}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
        )}
      </div>
    </div>
  );
}
