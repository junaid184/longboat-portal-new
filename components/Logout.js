import { useState } from "react";
import { useRouter } from "next/router";
import MessageAlert from "../components/messageAlert";
import LogoutIcon from "@mui/icons-material/Logout";
import Cookies from "js-cookie";
import { useTheme } from "../context/themeContext";
import {fetchApi} from "../fetchApi"; 
import jwt from "jsonwebtoken"; 

function Logout() {
  const router = useRouter();
  const [showAlert, setShowAlert] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { theme } = useTheme(); // Access the theme

  const handleLogout = async () => {
    const token = Cookies.get("ajs_anonymous_id"); 
    if (!token) {
      console.warn("Token not found, logging out.");
      performLogout();
      return;
    }

    const decoded = jwt.decode(token);
    const userId = decoded?.userId;
    let id = JSON.stringify(userId)

    if (!id) {
      console.warn("User ID not found in token, logging out.");
      performLogout();
      return;
    }

    try {
      console.log("Deleting queue for user:", id);

      const [data, error] = await fetchApi({
        method: "POST",
        endPoint: "Order/delete-queue",
        data: id,
        token,
      });

      if (error) {
        console.error("Error deleting queue:", error);
      } else {
        console.log("Queue deleted successfully:", data);
      }
    } catch (err) {
      console.error("Unexpected error while deleting queue:", err);
    }

    performLogout();
  };

  const performLogout = () => {
    Cookies.remove("ajs_anonymous_id");
    Cookies.remove("token");
    localStorage.clear();
    sessionStorage.clear();
    router.push("/");
  };

  const handleYes = () => {
    handleLogout();
  };

  const handleNo = () => {
    setShowAlert(false);
  };

  return (
    <div>
      {/* Logout Button */}
      <button
        aria-haspopup="true"
        onClick={() => setShowAlert(true)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="flex items-center justify-center mt-2 py-2 px-3 rounded-lg transition-colors duration-200"
        style={{
          backgroundColor: isHovered
            ? theme.hoverBackground
            : theme.buttonBackground,
          color: theme.text,
        }}
      >
        <LogoutIcon
          className="mr-1"
          style={{
            color: theme.text,
          }}
        />
        <span
          className="text-xl"
          style={{
            color: theme.text,
          }}
        >
          Logout
        </span>
      </button>

      {/* Message Alert */}
      {showAlert && (
        <MessageAlert
          type="normal"
          onClickYes={handleYes}
          onClickNo={handleNo}
        />
      )}
    </div>
  );
}

export default Logout;
