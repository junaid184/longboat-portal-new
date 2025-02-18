import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import * as signalR from "@microsoft/signalr";
import { addOrder, removeOrder } from "../components/redux/slices/ordersSlice";
import { baseUrl } from "../utils/constant";
import { toast } from "react-toastify";

const useSignalHub = () => {
  const reconnectIntervalRef = useRef(null);
  const connectionRef = useRef(null);
  const dispatch = useDispatch();

  const connect = () => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(baseUrl + "/ordersocket")
      .configureLogging(signalR.LogLevel.Information) // Enable logging for better diagnostics
      .build();

    connectionRef.current = connection;

    connection
      .start()
      .then(() => {
        console.log("Connected to the order hub");
        clearInterval(reconnectIntervalRef.current); // Clear the reconnect interval if successfully connected
      })
      .catch((err) => {
        console.error("Failed to start connection:", err);
      });

    connection.onreconnected(() => {
      console.log("Reconnected");
      clearInterval(reconnectIntervalRef.current); // Clear the reconnect interval if successfully reconnected
    });

    connection.on("ReceiveOrder", (order) => {
      let d = JSON.parse(order);
      toast.success("New Order: " + d?.eventName);
      dispatch(addOrder(JSON.parse(order)));
    });

    connection.on("OrderAccepted", (orderId) => {
      dispatch(removeOrder(orderId));
    });

    connection.on("OrderAcceptedWithCompleteOrderPayload", (order) => {
      let d = JSON.parse(order);
      dispatch(removeOrder(d?.orderId));
    });

    connection.onclose(async (error) => {
      console.error("Connection closed:", error);
      // Set up a reconnect interval if disconnected
      reconnectIntervalRef.current = setInterval(() => {
        console.log("Reconnecting...");
        connect();
      }, 3000);
    });
  };

  const invokeSignalRMethod = (methodName, ...args) => {
    if (connectionRef.current?.state === signalR.HubConnectionState.Connected) {
      connectionRef.current.invoke(methodName, ...args).catch((error) => {
        console.error(`Error invoking SignalR method ${methodName}:`, error);
      });
    } else {
      console.warn(
        "Connection is not in the 'Connected' state. Method invocation skipped."
      );
    }
  };

  useEffect(() => {
    // Initial connection attempt
    connect();

    // Cleanup on component unmount
    return () => {
      clearInterval(reconnectIntervalRef.current);
      connectionRef.current?.stop();
    };
  }, []);

  return {
    connect,
    invokeSignalRMethod,
    connectionRef,
  };
};

export default useSignalHub;
