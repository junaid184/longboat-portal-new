import { useRouter } from "next/router";
import loginsideImage from "../assets/images/loginSideImage.jpg";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { useTheme } from "../context/themeContext";
import useSignalHub from "../signalR/index";
import { useEffect } from "react";
import * as signalR from "@microsoft/signalr";
export default function Layout({ children }) {
  const router = useRouter();
  const { theme } = useTheme();
  const { connect, invokeSignalRMethod, connectionRef } = useSignalHub();

  // Set up SignalR connection
  useEffect(() => {
    if (
      !connectionRef.current ||
      connectionRef.current.state === signalR.HubConnectionState.Disconnected
    ) {
      connect();
    }

    // Cleanup on unmount
    return () => {
      if (connectionRef.current) {
        connectionRef.current.stop();
      }
    };
  }, [connect, connectionRef]);

  const layoutBgColor = theme === "light" ? "#fff" : "#333";
  const layoutTextColor = theme === "light" ? "#000" : "#fff";

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: layoutBgColor,
        color: layoutTextColor,
      }}
    >
      {router.pathname === "/" ? (
        <div className="flex min-h-screen">
          <div className="min-h-screen flex justify-center items-center">
            {/* SignalHub methods can be invoked here if needed */}
          </div>

          <div className="flex-1 min-h-screen">
            <main>{children}</main>
          </div>

          <aside
            className="w-[708px] mr-16 mt-3 rounded-tl-3xl rounded-tr-3xl"
            style={{
              backgroundImage: `url(${loginsideImage.src})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundColor: theme.background,
            }}
          />
        </div>
      ) : (
        <div className="flex min-h-screen newWidth">
          <Sidebar />
          <div className="flex-1" id="main-content">
            <Header />
            <main className="flex-1 mt-8">{children}</main>
          </div>
          <div
            className="w-5"
            style={{
              backgroundColor: theme.text,
            }}
          />
        </div>
      )}
    </div>
  );
}
