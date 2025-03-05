// userService.js
import { fetchApi } from "../fetchApi";
import { toast } from "react-toastify";

export const getOrdersApi = async (
    setLoading,
    setOrders,
    token,
    page = 1,
    pageSize = 10,
    setCount
  ) => {
    setLoading(true);

    try {
      const [response, error] = await fetchApi({
        method: "POST",
        endPoint: "Order/filter",
        data: { page: page + 1, pageSize },
        token,
      });

      setLoading(false);

      if (error) {
        throw new Error(
          error.response?.data?.message ||
            "An error occurred while fetching proxies."
        );
      }

      if (response?.data) {
        const responseData = response.data;

        // Correct the path to the data array
        const ordersWithIds = Array.isArray(responseData.data)
          ? responseData.data.map((order) => ({
              ...order,
              id: order.orderId || order.id,
            }))
          : [];

        // Update state with proxies and count if provided
        setCount(responseData.count || 0);
        setOrders(ordersWithIds);
      } else {
        throw new Error("Invalid response format from the server.");
      }
    } catch (err) {
      setLoading(false);
      toast.error(
        err.message || "Something went wrong while fetching proxies."
      );
    }
  };


export const handleDelete = async (orderId, token) => {
  const [data, error] = await fetchApi({
    method: "DELETE",
    endPoint: `Order/${orderId}`,
    token,
  });

  if (error) {
    toast.error(
      error.response ? error?.response?.data?.message : error.message
    );
    return false;
  }

  toast.success("Event deleted successfully.");
  return true;
};

export const handleActionApi = async (status, orderId, token) => {
  const [data, error] = await fetchApi({
    method: "GET",
    endPoint: `Order/updateOrderStatus?_status=${status}&OrderId=${orderId}`, // Construct the URL dynamically.
    token,
  });

  if (error) {
    toast.error(
      error.response ? error?.response?.data?.message : error.message
    );
    return false;
  }

  toast.success(`Order status updated successfully.`);
  return data;
};


export const updateInvoice = async (data, poId, poLineId, orderId, token) => {
  const JSONData = JSON.stringify(data);
  const [responseData, error] = await fetchApi({
    method: "POST",
    endPoint: "Order/po",
    data: { data: JSONData, poId, poLineId, orderId },
    token,
  });

  if (error) {
    toast.error(
      error.response ? error.response.data.message : error.message
    );
    return false;
  }

//   toast.success("Invoice updated successfully.");
//   return true;
// };


  toast.success("Invoice updated successfully.");
  return true;
};

export const getAutomatiqOrders = async (token , setOrders, setLoading) => {
  // setLoading(true);

  const [response, error] = await fetchApi({
    method: "GET",
    endPoint: `Order/GetAutomatiqOrders`,
    token,
  });
console.log(response,"response");
  // setLoading(false);

  if (error) {
    toast.error(error.response ? error.response.data.message : error.message);
    return;
  }
  if (response?.data) {
    setOrders(response.data);
  } else {
    toast.error("Unexpected response format from the API.");
  }
};
