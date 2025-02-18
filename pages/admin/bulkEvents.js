import React, { useState, useEffect } from "react";
import MuiGridDynamic from "../../components/MuiGridDynamic";
import userAvatar from "../../assets/images/avatar.png";
import { formatDateWithTime, formatDateWithTime1 } from "../../utils";
import Image from "next/image";
import SearchIcon from "@mui/icons-material/Search";
import { fetchApi } from "../../fetchApi";
import Link from "next/link";
import axios from "axios";
import Loader from "../../components/Loader";
import { MdAdd } from "react-icons/md";
import MessageAlert from "../../components/messageAlert";
import { toast } from "react-toastify";
import TicketModal from "../../components/TicketmasterModal";
import bulkIcon from "../../assets/images/bulkIcon.png";
import { useTheme } from "../../context/themeContext";
import { TicketMasterAPIKey } from "../../utils/constant";
import moment from "moment";

import { Button } from "@mui/material";
import StylishButton from "../../components/StylishButton";
import {
  eventSubmit,
  multipleDelete,
  deleteEvent,
  changeStatus,
} from "../../services/eventService";

export async function getServerSideProps(context) {
  const { req } = context;
  const token = req.cookies.ajs_anonymous_id;

  return {
    props: { token },
  };
}
const startDate = moment().add(2, "days").startOf("day");
const endDate = moment(startDate).add(14, "days").endOf("day");

const initialEventData = {
  type: 1,
  keyword: null,
  page: 1,
  pageSize: 50,
  startDate: startDate.format("YYYY-MM-DD"),
  endDate: endDate.format("YYYY-MM-DD"),
};

export default function Event({ token }) {
  const [events, setEvents] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState([]);
  const [type, setType] = useState(1);
  const [rows, setRows] = useState([]);
  const [count, setTotalCount] = useState(0);
  const [keyword, setKeyword] = useState(initialEventData.keyword);
  const [startTime, setStartTime] = useState(initialEventData.startDate);
  const [endTime, setEndTime] = useState(initialEventData.endDate);
  const [currentRow, setCurrentRow] = useState(null);
  const [open, setOpen] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedRowIds, setSelectedRowIds] = useState([]);
  const [formValues, setFormValues] = useState(initialEventData);
  const { theme } = useTheme();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [selectedEventIds, setSelectedEventIds] = useState([]);

  const fetchAllEventsIds = async (token) => {
    setLoading(true);
  
    const [response, error] = await fetchApi({
      method: "GET",
      endPoint: `Event/getAllEventsId`,
      token,
    });
  
    setLoading(false);
  
    if (error) {
      toast.error(error.response ? error.response.data.message : error.message);
      return;
    }
    if (response?.data && Array.isArray(response.data)) {
      setSelectedEventIds(response.data);
    } else {
      toast.error("Unexpected response format from the API.");
    }
  };
  

  // useEffect(() => {
  //   fetchAllEventsIds(token);
  // }, []);

  const fetchTicketMasterData = async ({
    keyword,
    page,
    pageSize,
    type,
    startTime,
    endTime,
  }) => {
    setLoading(true);
    try {
      const formatDate = (date) =>
        moment(date).format("YYYY-MM-DDTHH:mm:ss[Z]");
  
      let endPoint = "";
      switch (type) {
        case 1:
          endPoint = "discovery/v2/attractions";
          break;
        case 2:
          endPoint = "discovery/v2/venues";
          break;
        case 3:
        case 4:
        case 5:
          endPoint = "discovery/v2/events";
          break;
        default:
          console.error("Invalid type provided");
          return;
      }
  
      const params = {
        apikey: TicketMasterAPIKey,
        keyword: encodeURIComponent(keyword),
        size: pageSize,
        page: page,
        locale: "*",
        startDateTime: formatDate(startTime),
        endDateTime: formatDate(endTime),
      };
  
      if (type === 4) {
        params.attractionId = keyword;
        delete params.keyword;
      } else if (type === 5) {
        params.venueId = keyword;
        delete params.keyword;
      }
  
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_TICKETMASTER_BASE_URL}/${endPoint}`,
        {
          params,
        }
      );
  
      if (Array.isArray(response.data?._embedded?.events)) {
        const filteredEvents = response.data._embedded.events.filter((event) =>
          !selectedEventIds.includes(event.id)
        );
  
        const updatedRows = filteredEvents.map((event) => ({
          id: event.id,
          name: event.name,
          type: event.type,
          eventDate: event.dates.start.dateTime,
          image: event.images[0].url,
          url: event._embedded.venues[0].url,
          venueName: event._embedded.venues[0].name,
        }));
  
        console.log(updatedRows, "filtered updatedRows");
  
        setRows(updatedRows); 
        setTotalCount(filteredEvents.length); 
      } else {
        console.error("Unexpected API response structure:", response.data);
      }
    } catch (error) {
      console.error("Error fetching TicketMaster data:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    setIsEditMode(false);
    setFormValues(initialEventData);
  };

  const handleDeleteConfirm = async () => {
    if (selectedRow) {
      await handleDeleteEvent(selectedRow); // Pass selectedRow directly
      setShowDeleteConfirmation(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirmation(false);
  };

  const handlePageSizeChange = (newPageSize) => {
    console.log(`page size ${newPageSize}`);
    setPageSize(newPageSize);
  };

  const handlePageChange = (newPage) => {
    console.log(`page change ${newPage}`);
    setPage(newPage);
  };
  const handleDeleteEvent = async (eventId) => {
    console.log("Event ID to delete:", eventId);
    await deleteEvent(eventId, events, setEvents, token);
  };

  const showItemsClickHandler = (data) => {
    setSelectedRow(null);
    setSelectedItem(data);
    setIsEditMode(false);
    handleOpen();
  };

  const columns = [
    {
      field: "image",
      headerName: "Image",
      width: 120,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        const imageUrl = params.row.image;
        const isValidUrl =
          imageUrl &&
          (imageUrl.startsWith("/") ||
            imageUrl.startsWith("http://") ||
            imageUrl.startsWith("https://"));

        return (
          <div className="flex items-center w-60 justify-center space-x-4">
            <img
              className="rounded-full"
              src={isValidUrl ? imageUrl : userAvatar}
              alt="Event Image"
              width={70}
              height={120}
            />
          </div>
        );
      },
    },
    {
      field: "name",
      headerName: "Event Name",
      width: 220,
      headerAlign: "center",
      renderCell: (params) => (
        <div
          className="flex items-center justify-start w-80 space-x-4"
          style={{
            whiteSpace: "nowrap",
            overflowX: "auto",
            textOverflow: "ellipsis",
            height: "56px",
            lineHeight: "1",

            overflowY: "hidden",
          }}
        >
          <span>{params.row.name}</span>
        </div>
      ),
    },
    {
      field: "venueName",
      headerName: "Venue",
      width: 220,
      headerAlign: "center",
      renderCell: (params) => (
        <div
          className="flex items-center justify-start w-80 space-x-4 overflow-x-auto"
          style={{
            whiteSpace: "nowrap",
            overflowX: "auto",
            textOverflow: "ellipsis",
            height: "56px",
            lineHeight: "1",

            overflowY: "hidden",
          }}
        >
          <span>{params.row.venueName}</span>
        </div>
      ),
    },
    {
      field: "id",
      headerName: "TM-ID",
      width: 180,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => <span>{params.row.id}</span>,
    },
    {
      field: "eventDate",
      headerName: "Event Date",
      width: 200,
      align: "center",
      valueGetter: (params) => formatDateWithTime1(params.row.eventDate), // Access params.row for correct field
      headerAlign: "center",
    },
    {
      field: "url",
      headerName: "Event Url",
      width: 180,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <div className="flex">
          {params.row?.url ? (
            <Link href={params.row?.url} target="_blank">
              <span className="text-blue-800 font-semibold text-sm border-blue-500 p-2 border rounded-md hover:text-base hover:border-base">
                View Event
              </span>
            </Link>
          ) : (
            "N/A"
          )}
        </div>
      ),
    },
  ];

  const handleSelectionModelChange = (ids) => {
    setSelectedRowIds(ids);
  };
  const handleSelectedDelete = async () => {
    if (selectedRowIds.length > 0) {
      try {
        await multipleDelete(
          selectedRowIds,
          events,
          setEvents,
          token,
          page,
          pageSize,
          setCount,
          setLoading
        );
      } catch (error) {
        console.error("Failed to delete selected rows:", error);
      }
    } else {
      console.log("No rows selected for deletion");
    }
  };

  const handleSelectedExport = async () => {
    if (selectedRowIds.length > 0) {
      try {
        // Prepare the data for the API request
        const selectedRowsData = rows.filter((row) =>
          selectedRowIds.includes(row.id)
        );
        let finalData = selectedRowsData?.map((x) => {
          return {
            image: x?.image,
            eventName: x?.name,
            venueName: x?.venueName,
            tmEventId: x?.id,
            inHandDate: moment(x?.eventDate)
              .subtract(2, "days")
              .format("YYYY-MM-DD"),
            eventDate: x?.eventDate,
            listCostPercentage: 32,
            eventUrl: x?.url,
            hasGALAWNPIT: false,
            allowPreSales: false,
            isBroadCasting: false,
            isRady: false,
            cluster: 0,
          };
        });

        const [response, error] = await fetchApi({
          method: "POST",
          endPoint: "Event/BulkAdd",
          data: finalData, // Adjust key as per API requirements
          token,
        });

        if (error) {
          console.error("Error exporting rows:", error);
          return;
        }
        console.log("Rows exported successfully:", response);
      } catch (error) {
        console.error("An unexpected error occurred:", error);
      }
    } else {
      console.log("No rows selected for export.");
    }
  };

  // Define `refreshEvents` to re-fetch or refresh the data
  // const refreshEvents = async () => {
  //   try {
  //     await getEventsApi(setLoading, setEvents, token, page, pageSize, count);
  //   } catch (error) {
  //     console.error("Failed to refresh events:", error);
  //   }
  // };

  const colors = {
    background: theme === "light" ? "#2F2F2F" : "#686868",
    text: theme === "light" ? "#FFFFFF" : "#FFFFFF",
    border: theme === "light" ? "#FFFFFF" : "#E0E0E0",
    buttonHover: theme === "light" ? "#FF0000" : "#E0E0E0",
    buttonDeleteHoverBg: "#FF0000",
    buttonDeleteHoverText: "#FFFFFF",
  };
  return (
    <>
      <div className="border-collapse m-5  ">
        {loading && <Loader />}
        <div
          className="flex items-center relative z-10 justify-between rounded-xl h-20 ml-4 mr-4 px-4"
          style={{ backgroundColor: colors.background }}
        >
          <div className="flex items-center space-x-3">
            <Image
              src={bulkIcon}
              alt="logo"
              className="w-8 h-8"
              style={{ filter: "invert(100%)" }}
            />
            <h1
              className="text-3xl font-medium"
              style={{ color: theme === "light" ? "#fff" : "#fff" }}
            >
              Bulk Events
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            {/* Update Button */}
            {selectedRowIds.length > 0 && (
              <Button
                onClick={handleSelectedExport}
                variant="outlined"
                sx={{
                  color: colors.text,
                  borderColor: colors.border,
                  "&:hover": {
                    backgroundColor: colors.text,
                    color: colors.background,
                    borderColor: colors.text,
                  },
                }}
              >
                Import selected Events
              </Button>
            )}

            {/* Stylish Button (Bulk Events) */}
            <StylishButton onClick={() => showItemsClickHandler([])}>
              <SearchIcon
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "bolder",
                  marginRight: "2px",
                }}
              />{" "}
              Bulk Events
            </StylishButton>
          </div>
        </div>
        <TicketModal
          open={open}
          onClose={handleClose}
          selectedRow={selectedRow}
          initialValues={{
            type: "",
            keyword: "",
            startDate: "",
            endDate: "",
          }}
          isEditMode={isEditMode}
          onSubmit={(values) => {
            console.log("Form submitted:", values);
            
            fetchAllEventsIds(token);
            fetchTicketMasterData({
              keyword: values.keyword, 
              page: 0,
              pageSize: 200,
              type: parseInt(values.type, 10), 
              startTime: new Date(values.startDate).toISOString(),
              endTime: new Date(values.endDate).toISOString(), 
            });

            handleClose();
          }}
        />

        {showDeleteConfirmation && (
          <MessageAlert
            type="danger"
            onClickYes={handleDeleteConfirm}
            onClickNo={handleDeleteCancel}
          />
        )}
        <div className="relative -mt-10 z-0">
          <MuiGridDynamic
            rows={rows}
            columns={columns}
            loading={loading}
            totalCount={count} 
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            checkboxSelection
            onSelectionModelChange={handleSelectionModelChange}
          />
        </div>
      </div>
    </>
  );
}
