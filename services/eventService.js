import { fetchApi } from "../fetchApi";
import { toast } from "react-toastify";

export const getEventsApi = async (setLoading, setEvents, token , page = 1 , pageSize = 10 , setCount) => {
  setLoading(true);

  const [response, error] = await fetchApi({
    method: "POST",
    endPoint: "Event/filter",
    data: { page: page +1, pageSize },  
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
      id: event.setupEventId,
    }));
    setEvents(eventsWithId);
  } else {
    toast.error("Unexpected response format from the API.");
  }
};

export const eventSubmit = async (
  values,
  { setSubmitting },
  isEditMode,
  selectedRow,
  token,
  getEventsApi,
  handleClose
) => {
  setSubmitting(true); // Show loading state during submission

  try {
    let response;
    if (isEditMode) {
      response = await fetchApi({
        method: "PUT",
        endPoint: `Event`,
        data: {...values, setupEventId: selectedRow.id },
        token,
      });
      toast.success("Event updated successfully.");
    } else {
      response = await fetchApi({
        method: "POST",
        endPoint: "Event",
        data: { ...values, cluster: 0 },
        token,
      });
      toast.success("Event added successfully.");
    }
    getEventsApi();
    handleClose(); // Close modal after success
  } catch (error) {
    toast.error(error.response ? error.response.data.message : error.message);
  } finally {
    setSubmitting(false); // Stop loading state
  }
};

export const deleteEvent = async (eventId, events, setEvents, token) => {
  const [data, error] = await fetchApi({
    method: "DELETE",
    endPoint: `Event/?id=${eventId}`,
    token,
  });

  if (error) {
    toast.error(
      error.response ? error?.response?.data?.message : error.message
    );
    return;
  }

  toast.success("Event deleted successfully.");

  const eventsAfterDelete = events.filter((event) => event.id !== eventId);
  setEvents(eventsAfterDelete);
};

// export const changeStatus = async (eventId, events, setEvents, token) => {
//   const eventToUpdate = events.find((event) => event.id === eventId);
//   const newStatus = !eventToUpdate.isBroadCasting;

//   const [data, error] = await fetchApi({
//     method: "PUT",
//     endPoint: `Event/${eventId}`,
//     data: { ...eventToUpdate, isBroadCasting: newStatus },
//     token,
//   });

//   if (error) {
//     toast.error(error.response ? error.response.data.message : error.message);
//     return;
//   }

//   const updatedEvents = events.map((event) =>
//     event.id === eventId ? { ...event, isBroadCasting: newStatus } : event
//   );

//   setEvents(updatedEvents);

//   toast.success("Broadcast status updated successfully!");
// };

export const updateMultipleFields = async (selectedEventIds, updates, token, refreshEvents) => {
  console.log("Inside updateMultipleFields:", updates.broadcastStatus, typeof updates.broadcastStatus);

  const values = {
    eventId:selectedEventIds,
    broadcastStatus: updates.broadcastStatus, // Use updates.broadcastStatus
    listCostPercentage: updates.listCostPercentage,
  };

  const [data, error] = await fetchApi({
    method: "POST",
    endPoint: `Event/UpdateEventDetails`,
    data: values,
    token,
  });

  if (error) {
    toast.error(error.response ? error.response.data.message : error.message);
    return;
  }

  toast.success("Multiple Events updated successfully!");
  
  if (refreshEvents) {
    refreshEvents();
  }
};

export const multipleDelete = async (selectedEventIds, events, setEvents, token, page = 1, pageSize = 0, setCount, setLoading) => {
  if (!selectedEventIds || selectedEventIds.length === 0) {
    toast.error("No events selected for deletion.");
    return;
  }

  const eventIdsString = JSON.stringify(selectedEventIds);

  try {
    // Make the bulk delete request
    const [data, error] = await fetchApi({
      method: "POST",
      endPoint: "Event/bulkDelete",
      data: { data: eventIdsString },
      token,
    });

    if (error) {
      toast.error(error.response ? error.response.data.message : error.message);
      return;
    }

    if (data?.isSuccess) {
      toast.success("Events deleted successfully.");

      // Update the events state by removing the deleted events
      const updatedEvents = events.filter(
        (event) => !selectedEventIds.includes(event.setupEventId)
      );
      setEvents(updatedEvents);

      // Call getEventsApi to update the events and pagination count
      getEventsApi(setLoading, setEvents, token, page, pageSize, setCount);

      return true;
    } else {
      toast.error(data?.message || "Failed to delete events.");
    }
  } catch (err) {
    toast.error(err.message || "Something went wrong.");
  }
};









