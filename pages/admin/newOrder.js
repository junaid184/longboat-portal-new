import React, { useState, useEffect } from "react";
import { Card, CardContent, Typography, Button ,CircularProgress} from "@mui/material";
import { fetchApi } from "../../fetchApi";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { useTheme } from "../../context/themeContext";
import Head from "next/head";
import Loader from "../../components/Loader";
import jsonwebtoken from "jsonwebtoken";

export async function getServerSideProps(context) {
  const { req } = context;
  const token = req.cookies.ajs_anonymous_id;

  return {
    props: { token },
  };
}

export default function NewOrders({ token }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [joinedQueue, setJoinedQueue] = useState(false);
  const { theme } = useTheme();
  const router = useRouter();

  const fetchOrders = async (userId) => {
    setLoading(true);

    const [response, error] = await fetchApi({
      method: "GET",
      endPoint: `order/unfilled?userId=${userId}`,
      token,
    });

    setLoading(false);

    if (error) {
      toast.error(error.response ? error.response.data.message : error.message);
      return;
    }

    if (response?.data?.data) {
      setOrders(
        response.data.data.map((log) => ({
          title: log.eventName,
          venue: log.venueName,
          details: `Quantity: ${log.qty} | Section: ${log.sec} | Row: ${log.row} | Seats: ${log.seats}`,
          price: `${log.totalCost} USD`,
          tag: log.tag,
          eventId: log.eventId,
          orderId: log.orderId,
          tmEventId: log.tmEventId,
        }))
      );
    } else {
      toast.error("Unexpected response format from the API.");
    }
  };

  const acceptOrder = async (orderId) => {
    setLoading(true);

    const [response, error] = await fetchApi({
      method: "GET",
      endPoint: `order/AcceptOrder?orderId=${orderId}`, // Correct endpoint
      token,
    });

    setLoading(false);

    if (error) {
      toast.error(error.response ? error.response.data.message : error.message);
      return false; // Return false on error
    }

    if (response?.isSuccess) {
      // Check for the isSuccess flag
      setOrders(orders.filter((log) => log.id !== orderId)); // Update the logs
      toast.success(response.message || "Order accepted successfully"); // Use the message from the response
      return true; // Return true if successful
    } else {
      toast.error("Order acceptance failed. Please try again."); // Generic error if isSuccess is false
      return false; // Return false
    }
  };

  const joinQueue = async (userId) => {
    setLoading(true);
    const [response, error] = await fetchApi({
      method: "POST",
      endPoint: `Order/join-queue?Id=${userId}`,
      token,
    });
    setLoading(false);

    if (error) {
      toast.error(error.response ? error.response.data.message : error.message);
      return;
    }

    if (response?.isSuccess) {
      toast.success(response.message || "Queue joined successfully");
      setJoinedQueue(true);
    } else if (response?.message === "Already in queue.") {
      toast.info("You are already in the queue.");
      setJoinedQueue(true);
    } else {
      toast.error(response.message || "Join in Queue failed. Please try again.");
    }
  };

  const userId = jsonwebtoken.decode(token)?.userId;

  useEffect(() => {
    fetchOrders(userId);
    const handleUnload = async () => {
      await fetch(`${process.env.NEXT_PUBLIC_BaseURL}/api/Order/delete-queue`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userId),
        keepalive: true, // Ensures the request completes even if the tab closes
      });
    };

    window.addEventListener("beforeunload", handleUnload);
    // document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
      // document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [userId]);


  const colors = {
    background: theme === "light" ? "#2F2F2F" : "#686868",
    text: theme === "light" ? "#FFFFFF" : "#FFFFFF",
    border: theme === "light" ? "#FFFFFF" : "#E0E0E0",
    buttonHover: theme === "light" ? "#FF0000" : "#E0E0E0",
    buttonDeleteHoverBg: "#FF0000",
    buttonDeleteHoverText: "#FFFFFF",
  };

  const OrderCard = ({
    title,
    venue,
    details,
    price,
    tag,
    tmEventId,
    orderId,
  }) => (
    <Card
      className="text-white rounded-lg shadow-md w-full max-w-sm"
      style={{ backgroundColor: colors.background }}
    >
      <CardContent>
        <Typography variant="h6" className="font-bold">
          {title}
        </Typography>
        <Typography className="text-sm text-gray-300 mb-4">{venue}</Typography>
        <Typography className="text-sm text-gray-300 mb-2">
          {details}
        </Typography>
        <Typography className="text-lg font-bold mb-4">
          Sale Price: {price}
        </Typography>
        <Typography className="text-sm text-gray-300">Tag: {tag}</Typography>
        <div className="flex justify-between">
          <button
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-950 mt-10"
            onClick={() => {
              const tmUrl = `https://www.ticketmaster.com/event/${tmEventId}`;
              window.open(tmUrl, "_blank");
            }}
          >
            Open TM URL
          </button>
          <Button
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-950 mt-10"
            onClick={async () => {
              const isSuccess = await acceptOrder(orderId); // Call the API function
              if (isSuccess) {
                window.open(
                  `/admin/update-invoice?orderId=${orderId}`,
                  "_blank"
                ); // Open URL if success
              }
            }}
          >
            Approve Order
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="h-[800px]  bg-gray-50 text-gray-950">
      <Head>
        <title>Virtual Queue</title>
      </Head>

      {!joinedQueue ? (
        <div className="flex justify-center items-center h-[800px]">
          <button
            className="px-12 py-6 bg-[#2F2F2F] text-white text-2xl rounded-lg hover:bg-gray-700"
            onClick={() => joinQueue(jsonwebtoken.decode(token).userId)}
          >
            {loading ? (
                              <CircularProgress size={32} color="inherit" />
                            ) : (
                              "Join Queue"
                            )}
          </button>
        </div>
      ) : !orders ? (
        <>
          <header className="py-4">
            <h1 className="text-center text-xl font-bold">
              Trevor Noah: Back To Abnormal
            </h1>
            <p className="text-center text-sm text-gray-400">
              Chase Center - San Francisco, CA
            </p>
          </header>

          <main className="px-6">
            <div className="mt-8 flex flex-col items-center">
              <div className="w-full max-w-lg bg-gray-100 border border-gray-600 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-center">
                  You Are Now in The Queue
                </h2>
                <p className="text-gray-400 text-center">1 Person Ahead of You</p>
                <div className="w-full max-w-lg mt-4 bg-gray-700 rounded-full">
                  <div className="relative w-full max-w-lg bg-gray-700 rounded-full h-4">
                    <div
                      className="bg-[#2F2F2F] rounded-full h-full"
                      style={{ width: "100%" }}
                    ></div>
                    <div className="absolute top-1/2 right-0 -translate-y-1/2 bg-gray-500 rounded-full h-6 w-6 border-2 border-gray-700"></div>
                  </div>
                </div>
                <p className="mt-2 text-gray-500 text-xs text-center">
                  Queue ID: FE3546B-18B0-4B8E-BD27-88BD7066E750
                </p>
              </div>
            </div>
          </main>
        </>
      ) : (
        <div className="min-h-screen py-10">
          {loading && <Loader />}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4">
            {orders.map((order, index) => (
              <OrderCard key={index} {...order} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
