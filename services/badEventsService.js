// userService.js
import { fetchApi } from "../fetchApi";
import { toast } from "react-toastify";

export const getBadEventsApi = async (setLoading, setEvents, token , page = 1 , pageSize = 0 , setCount) => {
  setLoading(true);

  const [response, error] = await fetchApi({
    method: "POST",
    endPoint: "Event/GetAllBadEvents",
    data: { page:page+1, pageSize },  
    token,
  });

  setLoading(false);

  if (error) {
    toast.error(
      error.response ? error.response.data.message : error.message
    );
    return;
  }

  if (response?.data?.data) {
    setCount(response?.data?.count)
    const eventsWithId = response.data.data.map((event) => ({
      ...event,
      id: event.setupBadEventId,
    }));
    setEvents(eventsWithId);
    
  } else {
    toast.error("Unexpected response format from the API.");
  }
};

export const handleDelete = async (badEventId, token) => {
  const [data, error] = await fetchApi({
    method: "DELETE",
    endPoint: `BadEvent/${badEventId}`,
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

export const multipleMoveOrdelete = async (selectedRow, actionType, token) => {
  const badEventIds = selectedRow.map((row) => row.tmEventId); // Map to get the event IDs
  
  const [data, error] = await fetchApi({
    method: "POST",
    endPoint: `Event/MoveOrDelete?id=${badEventIds}`,
    data: actionType,
    token,
  });

  if (error) {
    toast.error(
      error.response ? error.response.data.message : error.message
    );
    return false;
  }

  toast.success(`Events ${actionType === "delete" ? "deleted" : "moved"} successfully.`);
  return true;
};
