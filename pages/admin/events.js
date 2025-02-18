import React, { useState, useEffect } from "react";
import MuiGridNew from "../../components/MuiGridNew";
import userAvatar from "../../assets/images/avatar.png";
import { formatDateWithTime } from "../../utils";
import Image from "next/image";
import Link from "next/link";
import axios from 'axios';
import Loader from "../../components/Loader";
import { MdAdd } from "react-icons/md";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import MessageAlert from "../../components/messageAlert";
import { addEventSchema } from "../../utils/validation";
import EventModal from "../../components/EventModal";
import eventIcon from "../../assets/images/events.png";
import { useTheme } from "../../context/themeContext";

import {
  IconButton,
  FormControl,
  InputLabel,
  Menu,
  Select,
  MenuItem,
  TextField,
  Button,
} from "@mui/material";
import StylishButton from "../../components/StylishButton";
import {
  getEventsApi,
  eventSubmit,
  multipleDelete,
  deleteEvent,
  updateMultipleFields,
  changeStatus,
} from "../../services/eventService";

export async function getServerSideProps(context) {
  const { req } = context;
  const token = req.cookies.ajs_anonymous_id;

  return {
    props: { token },
  };
}

const initialEventData = {
 eventName: "",
  venueName: "",
  tmEventId: "",
  eventMappingId: "",
  image: "",
  inHandDate: null,
  eventDate: null,
  listCostPercentage: 0,
  eventUrl: "",
  hasGALAWNPIT: false,
  allowPreSales: false,
  shownQuantity: 0,
  rank: 1,
  createdBy:-1,
  // isActive: false,
};
export default function Event({ token }) {
  const [events, setEvents] = useState([]);
  const [anchorEls, setAnchorEls] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [currentRow, setCurrentRow] = useState(null);
  const [open, setOpen] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedRowIds, setSelectedRowIds] = useState([]);
  const [formValues, setFormValues] = useState(initialEventData);
  const [isBroadCasting, setIsBroadCasting] = useState(""); // start with a Boolean
  const [listCostPercentage, setListCostPercentage] = useState("");
  const { theme } = useTheme(); // Access the current theme
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [count ,setCount] = useState(0);


  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    setIsEditMode(false);
    setFormValues(initialEventData);
  };

  const handleInputChange = (field, value) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [field]: value, // Directly update the field
    }));
  };

  const handleMenuOpen = (event, row) => {
    setAnchorEls((prev) => ({ ...prev, [row.id]: event.currentTarget }));
    setCurrentRow(row);
  };

  const handleMenuClose = () => {
    setAnchorEls({});
    setCurrentRow(null);
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

  const handleActionClick = async (action) => {
    if (currentRow) {
      switch (action) {
        // case "broadcast":
        //   console.log("Change Broadcast Status clicked", currentRow);
        //   // Handle broadcast status change
        //   handleChangeStatus(currentRow.id);
        //   break;
        case "edit":
          console.log("Edit clicked");
          UpdateItemsClickHandler("edit", currentRow);
          break;
        case "delete":
          setSelectedRow(currentRow.setupEventId);
          setShowDeleteConfirmation(true);
          break;
        case "logs":
          
          window.open(`/admin/logs/?eventId=${currentRow.setupEventId}`, "_blank"); // Open specific log based on row ID
          break;
        // case "report":
        //   window.open(
        //     `/admin/reports/?eventMappingId=${currentRow.eventMappingId}`,
        //     "_blank"
        //   ); // Open specific log based on row ID
        //   break;
        default:
          break;
      }
      handleMenuClose();
    }
  };

  useEffect(() => {
    getEventsApi(setLoading,setEvents , token , page, pageSize , setCount); 
    // Pass token as an argument to fetchData
  }, [page,pageSize]);

  const handleEventSubmit = (values, formikHelpers) => {
    eventSubmit(
      values,
      formikHelpers,
      isEditMode,
      selectedRow,
      token,
      () => getEventsApi(setLoading, setEvents, token , page, pageSize , setCount),
      handleClose
    );
  };
  const handlePageSizeChange = (newPageSize) => {
    console.log(`page size ${newPageSize}`);
    setPageSize(newPageSize);
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    console.log(`page change ${newPage}`);
    setPage(newPage);
  };
  const handleDeleteEvent = async (eventId) => {
    console.log("Event ID to delete:", eventId);
    await deleteEvent(eventId, events, setEvents, token); // Await for deleteEvent to finish
  };

  // const handleChangeStatus = (eventId) => {
  //   changeStatus(eventId, events, setEvents, token);
  // };

  const showItemsClickHandler = (data) => {
    setSelectedRow(null);
    setSelectedItem(data);
    setIsEditMode(false);
    handleOpen();
  };

  const UpdateItemsClickHandler = (actionType, eventData) => {
    if (actionType === "edit") {
      // Convert inHandDate to date-only format (yyyy-MM-dd)
      const inHandDate = eventData.inHandDate
        ? new Date(eventData.inHandDate).toISOString().split("T")[0]
        : null; // Handle cases where inHandDate might be null or undefined
  
      // Update eventData with the formatted inHandDate
      const updatedEventData = { ...eventData, inHandDate };
  
      console.log(updatedEventData, "Updated event data with date-only inHandDate");
  
      setSelectedRow(updatedEventData);
      setSelectedEventId(updatedEventData.id);
      setIsEditMode(true);
      handleOpen();
    }
  };
  

  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 80,
      headerAlign: "center",
      align: "center",
    },
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
      field: "eventName",
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
          <span>{params.row.eventName}</span>
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
      field: "tmEventId",
      headerName: "TM-ID",
      width: 180,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => <span>{params.row.tmEventId}</span>,
    },
    {
      field: "eventMappingId",
      headerName: "Event Mapping Id",
      width: 150,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => <span>{params.row.eventMappingId}</span>,
    },
    {
      field: "inHandDate",
      headerName: "In Hand Date",
      width: 200,
      headerAlign: "center",
      align: "center",
      valueGetter: (params) => formatDateWithTime(params.row.inHandDate), // Access params.row for correct field
    },
    {
      field: "eventDate",
      headerName: "Event Date",
      width: 200,
      headerAlign: "center",
      align: "center",
      valueGetter: (params) => formatDateWithTime(params.row.eventDate), // Access params.row for correct field
    },

    {
      field: "listCostPercentage",
      headerName: "Cost %",
      width: 150,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => <span>{params.row.listCostPercentage}%</span>,
    },
    {
      field: "eventUrl",
      headerName: "Event Url",
      width: 180,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <div className="flex">
          {params.row?.eventUrl ? (
            <Link href={params.row?.eventUrl} target="_blank">
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
    {
      field: "isBroadCasting",
      headerName: "BroadCasting Events",
      width: 160,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        return (
          <div className="w-28 h-10 flex justify-center items-center">
            {params.row.isBroadCasting ? (
              <span className="p-2 h-9 flex font-extrabold justify-center items-center rounded-2xl text-green-700">
                <b>True</b>
              </span>
            ) : (
              <span className="p-2 h-9 flex justify-center font-extrabold items-center rounded-2xl text-red-700">
                <b>False</b>
              </span>
            )}
          </div>
        );
      },
    },
    {
      field: "extraInternalNotes",
      headerName: "Notes",
      width: 250,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <span>
          {params.row.extraInternalNotes?.length > 30
            ? `${params.row.extraInternalNotes.slice(0, 30)}...`
            : params.row.extraInternalNotes}
        </span>
      ),
    },
    // {
    //   field: "isModal",
    //   headerName: "isModal",
    //   width: 120,
    //   headerAlign: "center",
    //   align: "center",
    //   renderCell: (params) => {
    //     return (
    //       <div className="w-28 h-10 flex justify-center items-center">
    //         {params.row.isModal ? (
    //           <span className="p-2 h-9 flex font-extrabold justify-center items-center rounded-2xl text-green-700">
    //             <b>True</b>
    //           </span>
    //         ) : (
    //           <span className="p-2 h-9 flex justify-center font-extrabold items-center rounded-2xl text-red-700">
    //             <b>False</b>
    //           </span>
    //         )}
    //       </div>
    //     );
    //   },
    // },
    // {
    //   field: "isSideBar",
    //   headerName: "isSideBar",
    //   width: 120,
    //   headerAlign: "center",
    //   align: "center",
    //   renderCell: (params) => {
    //     return (
    //       <div className="w-28 h-10 flex justify-center items-center">
    //         {params.row.isSideBar ? (
    //           <span className="p-2 h-9 flex font-extrabold justify-center items-center rounded-2xl text-green-700">
    //             <b>True</b>
    //           </span>
    //         ) : (
    //           <span className="p-2 h-9 flex justify-center font-extrabold items-center rounded-2xl text-red-700">
    //             <b>False</b>
    //           </span>
    //         )}
    //       </div>
    //     );
    //   },
    // },
    // {
    //   field: "isMap",
    //   headerName: "isMap",
    //   width: 120,
    //   headerAlign: "center",
    //   align: "center",
    //   renderCell: (params) => {
    //     return (
    //       <div className="w-28 h-10 flex justify-center items-center">
    //         {params.row.isMap ? (
    //           <span className="p-2 h-9 flex font-extrabold justify-center items-center rounded-2xl text-green-700">
    //             <b>True</b>
    //           </span>
    //         ) : (
    //           <span className="p-2 h-9 flex justify-center font-extrabold items-center rounded-2xl text-red-700">
    //             <b>False</b>
    //           </span>
    //         )}
    //       </div>
    //     );
    //   },
    // },
    {
      field: "action",
      headerName: "Action",
      width: 120,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        const open = Boolean(anchorEls[params.row.id]);

        return (
          <div>
            <IconButton onClick={(event) => handleMenuOpen(event, params.row)}>
              <MoreVertIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEls[params.row.id]}
              open={open}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "center",
              }}
            >
              {/* <MenuItem
                onClick={() => {
                  handleActionClick("broadcast");
                  handleMenuClose();
                }}
              >
                Change Broadcast Status
              </MenuItem> */}
              <MenuItem
                onClick={() => {
                  UpdateItemsClickHandler("edit", params.row);
                  handleMenuClose();
                }}
              >
                Edit
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleActionClick("delete");
                  handleMenuClose();
                }}
              >
                Delete
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleActionClick("logs", params.row.id);
                  handleMenuClose();
                }}
              >
                Logs
              </MenuItem>
              {/* <MenuItem
                onClick={() => {
                  handleActionClick("report", params.row.id);
                  handleMenuClose();
                }}
              >
                Reports
              </MenuItem> */}
            </Menu>
          </div>
        );
      },
    },
  ];

  const handleSelectionModelChange = (ids) => {
    setSelectedRowIds(ids);
  };
  const handleSelectedDelete = async () => {
    if (selectedRowIds.length > 0) {
      try {
        await multipleDelete(selectedRowIds, events, setEvents, token ,page, pageSize, setCount, setLoading);
        
      } catch (error) {
        console.error("Failed to delete selected rows:", error);
      }
    } else {
      console.log("No rows selected for deletion");
    }
  };

  const handleSelectedUpdate = async () => {
    if (selectedRowIds.length > 0) {
      console.log("broadcast status check", isBroadCasting);
      const updates = {
        broadcastStatus: isBroadCasting, // Directly use the Boolean value
        listCostPercentage: listCostPercentage,
      };

      await updateMultipleFields(selectedRowIds, updates, token, refreshEvents);
    } else {
      console.log("No rows selected for update");
    }
  };

  // Define `refreshEvents` to re-fetch or refresh the data
  const refreshEvents = async () => {
    try {
      await getEventsApi(setLoading, setEvents, token, page, pageSize, setCount);
    } catch (error) {
      console.error("Failed to refresh events:", error);
    }
  };

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
      {selectedRowIds.length > 0 && (
        <div
          className="flex items-center justify-center border rounded-xl h-20 mr-10 ml-9"
          style={{ backgroundColor: colors.background }}
        >
          <div className="flex items-center space-x-8">
            {/* Broadcasting Status Dropdown */}
            <FormControl
              variant="filled"
              sx={{
                m: 1,
                minWidth: 170,
                "& .MuiFilledInput-root": {
                  color: colors.text,
                  backgroundColor: "transparent",
                  "&:before": { borderBottom: `2px solid ${colors.text}` },
                  "&:hover:not(.Mui-disabled):before": {
                    borderBottom: `2px solid ${colors.text}`,
                  },
                  "&:after": { borderBottom: `2px solid ${colors.text}` },
                },
              }}
            >
              <InputLabel
                id="broadcasting-label"
                sx={{
                  color: colors.text,
                  "&.Mui-focused": { color: colors.text },
                }}
              >
                Broadcasting Status
              </InputLabel>
              <Select
                labelId="broadcasting-label"
                value={isBroadCasting.toString()} // Convert Boolean to string
                onChange={(e) => setIsBroadCasting(e.target.value === "true")}
                sx={{
                  color: colors.text,
                  "& .MuiSelect-icon": { color: colors.text },
                  "& .MuiFilledInput-root": {
                    "&:before": { borderBottomColor: colors.text },
                    "&:hover:not(.Mui-disabled):before": {
                      borderBottomColor: colors.text,
                    },
                    "&:after": { borderBottomColor: colors.text },
                  },
                }}
              >
                <MenuItem value="true">True</MenuItem>
                <MenuItem value="false">False</MenuItem>
              </Select>
            </FormControl>

            {/* List Cost Percentage Input */}
            <TextField
              label="List Cost Percentage"
              variant="filled"
              type="number"
              value={listCostPercentage}
              onChange={(e) => setListCostPercentage(Number(e.target.value))}
              InputProps={{
                inputProps: { min: 0 },
                style: { color: colors.text },
              }}
              InputLabelProps={{
                style: { color: colors.text },
                sx: { "&.Mui-focused": { color: colors.text } },
              }}
              sx={{
                minWidth: 120,
                "& .MuiFilledInput-root": {
                  "&:before": { borderBottomColor: colors.text },
                  "&:hover:not(.Mui-disabled):before": {
                    borderBottomColor: colors.text,
                  },
                  "&:after": { borderBottomColor: colors.text },
                },
              }}
            />

            {/* Update Button */}
            <Button
              onClick={handleSelectedUpdate}
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
              Update
            </Button>

            {/* Delete Button */}
            <Button
              onClick={handleSelectedDelete}
              variant="outlined"
              sx={{
                color: colors.text,
                borderColor: colors.border,
                "&:hover": {
                  backgroundColor: colors.buttonDeleteHoverBg,
                  borderColor: colors.buttonDeleteHoverText,
                },
              }}
            >
              Delete
            </Button>
          </div>
        </div>
      )}

      <div className="border-collapse m-5  ">
        {loading && <Loader />}
        <div
          className="flex items-center relative z-10 justify-between rounded-xl h-20 ml-4 mr-4 px-4"
          style={{ backgroundColor: colors.background }}
        >
          <div className="flex items-center space-x-3">
            <Image
              src={eventIcon}
              alt="logo"
              className="w-7 h-7"
              style={{filter:"invert(100%)"}}
            />
            <h1
              className="text-3xl font-medium"
              style={{ color: theme === "light" ? "#fff" : "#fff" }}
            >
              Events
            </h1>
          </div>

          <StylishButton onClick={() => showItemsClickHandler([])}>
            <MdAdd
              style={{
                fontSize: "1.5rem",
                fontWeight: "bolder",
                marginRight: "2px",
              }}
            />{" "}
            Add Event
          </StylishButton>
        </div>
        <EventModal
          open={open}
          onClose={handleClose}
          initialValues={selectedRow || initialEventData}
          validationSchema={addEventSchema}
          onSubmit={handleEventSubmit}
          isEditMode={isEditMode}
        />

        {showDeleteConfirmation && (
          <MessageAlert
            type="danger"
            onClickYes={handleDeleteConfirm}
            onClickNo={handleDeleteCancel}
          />
        )}
        <div className="relative -mt-10 z-0">
        <MuiGridNew
      rows={events}
      columns={columns}
      loading={loading}
      totalCount={count} // Replace with your total row count
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