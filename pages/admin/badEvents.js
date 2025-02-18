import React, { useState, useEffect } from "react";
import {formatDateWithTime } from "../../utils";
import Link from "next/link";
import userAvatar from "../../assets/images/avatar.png";
import MuiGridNew from "../../components/MuiGridNew";
import MessageAlert from "../../components/messageAlert";
import badEventsIcon from "../../assets/images/badEvents.png";
import Image from "next/image";
import { getBadEventsApi, handleDelete ,multipleMoveOrdelete} from "../../services/badEventsService";
import Loader from '../../components/Loader';
import { useTheme } from "../../context/themeContext";

export async function getServerSideProps(context) {
  const { req } = context;
  const token = req.cookies.ajs_anonymous_id;

  return {
    props: { token },
  };
}

export default function BadEvents({ token }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [anchorEls, setAnchorEls] = useState({});
  const [currentRow, setCurrentRow] = useState(null);
  const [selectedRow, setSelectedRow] = useState([]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [open, setOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedBadEventId, setSelectedBadEventId] = useState(null);
  const [selectedBadEventIds, setSelectedBadEventIds] = useState([]); 
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [count ,setCount] = useState(0);

  // Fetch data
  useEffect(() => {
    setLoading(true);
    fetchBadEvents(setLoading, setEvents, token, page, pageSize, setCount);
  }, [page, pageSize]);

  const handlePageSizeChange = (newPageSize) => {
    console.log(`page size ${newPageSize}`);
    setPageSize(newPageSize);
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    console.log(`page change ${newPage}`);
    setPage(newPage);
  };

  const fetchBadEvents = async () => {
    const events = await getBadEventsApi(setLoading,setEvents , token , page, pageSize , setCount);
    setLoading(false);
    if (events) {
      const eventsWithIds = events.map((event) => ({ ...event, id: event.badEventId }));
      setEvents(eventsWithIds);
    }
  };
  const handleMenuOpen = (event, row) => {
    setAnchorEls((prev) => ({ ...prev, [row.id]: event.currentTarget }));
    setCurrentRow(row);
  };
  const handleMenuClose = () => {
    setAnchorEls({});
    setCurrentRow(null);
  };
  
  const handleAction = async (actionType) => {
    if (selectedRow.length === 0) {
      return;
    }
  
    const success = await multipleMoveOrdelete(selectedRow, actionType, token);
    if (success) {
      const selectedBadEventIds = selectedRow.map(row => row.setupBadEventId);
  
      setEvents((prevEvents) => {
          console.log('Previous Events:', prevEvents);
          console.log('Selected Rows (IDs to delete):', selectedBadEventIds);
  
          const updatedRows = prevEvents.filter(event => !selectedBadEventIds.includes(event.setupBadEventId));
          console.log('Updated Rows (After filtering):', updatedRows);
          fetchBadEvents(setLoading, setEvents, token, page, pageSize, setCount);
  
      });
  }
  
  }  
  const handleActionClick = async (action) => {
    if (currentRow) {
      switch (action) {
       
        case "delete":
          console.log("Delete clicked", currentRow);
          setSelectedRow(currentRow.id);
          setShowDeleteConfirmation(true);
          break;
        default:
          break;
      }
      handleMenuClose();
    }
  };
  const handleDeleteEvent = async (badEventId) => {
    console.log("Event ID to delete:", badEventId);
    const success = await handleDelete(badEventId, token);
    
    if (success) {
      // Update state by removing the deleted event
      setEvents(prevEvents => prevEvents.filter(event => event.id !== badEventId));
    }
  };

  const handleSelectionModelChange = (newSelection) => {
    console.log("Selected Row IDs:", newSelection);
  
    // Map selected row ids to the full row objects
    const selectedRowsData = newSelection.map((id) => events.find((row) => row.id === id));
    setSelectedRow(selectedRowsData); // Set the full row objects
  
    console.log("Selected Rows Data:", selectedRowsData);
  };
  
  const showItemsClickHandler = (data) => {
    setSelectedBadEventId(data?.userId || null);
    setIsEditMode(!!data);
    setSelectedRow(data);
    handleOpen();
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleDeleteConfirm = async () => {
    if (selectedRow) {
      console.log("Deleting Event ID:", selectedRow);
      await handleDeleteEvent(selectedRow); // Pass selectedRow directly
      setShowDeleteConfirmation(false);
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
          className="flex items-center justify-center w-80 space-x-4"
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
          className="flex items-center justify-center w-80 space-x-4 overflow-x-auto"
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
      width: 150,
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
      field: "hasGALAWNPIT",
      headerName: "BroadCasting Events",
      width: 160,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        return (
          <div className="w-28 h-10 flex justify-center items-center">
            {params.row.hasGALAWNPIT ? (
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
      field: "allowPreSales",
      headerName: "BroadCasting Events",
      width: 160,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        return (
          <div className="w-28 h-10 flex justify-center items-center">
            {params.row.allowPreSales ? (
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
    // {
    //   field: "isRady",
    //   headerName: "BroadCasting Events",
    //   width: 160,
    //   headerAlign: "center",
    //   align: "center",
    //   renderCell: (params) => {
    //     return (
    //       <div className="w-28 h-10 flex justify-center items-center">
    //         {params.row.isRady ? (
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
      field: "cluster",
      headerName: "Cost %",
      width: 150,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => <span>{params.row.cluster}%</span>,
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
    {
      field: "excludeFromArbVivid",
      headerName: "BroadCasting Events",
      width: 160,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        return (
          <div className="w-28 h-10 flex justify-center items-center">
            {params.row.excludeFromArbVivid ? (
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
    // {
    //   field: "action",
    //   headerName: "Action",
    //   width: 120,
    //   headerAlign: "center",
    //   align: "center",
    //   renderCell: (params) => {
    //     const open = Boolean(anchorEls[params.row.id]);

    //     return (
    //       <div>
    //         <IconButton onClick={(event) => handleMenuOpen(event, params.row)}>
    //           <MoreVertIcon />
    //         </IconButton>
    //         <Menu
    //           anchorEl={anchorEls[params.row.id]}
    //           open={open}
    //           onClose={handleMenuClose}
    //           anchorOrigin={{
    //             vertical: "bottom",
    //             horizontal: "center",
    //           }}
    //           transformOrigin={{
    //             vertical: "top",
    //             horizontal: "center",
    //           }}
    //         >
    //            <MenuItem
    //             onClick={() => {
    //               handleAction("Move");
    //               handleMenuClose();
    //             }}
    //           >
    //             Move
    //           </MenuItem>
    //           <MenuItem
    //             onClick={() => {
    //               handleActionClick("delete");
    //               handleMenuClose();
    //             }}
    //           >
    //             Delete
    //           </MenuItem>
    //         </Menu>
    //       </div>
    //     );
    //   },
    // },
  ];

  const { theme } = useTheme();

  const styles = {
    dark: {
      containerBg: "#686868",
      textColor: "#FFFFFF",
      buttonBg: "#F9F9F9",
      buttonText: "#2F2F2F",
      buttonHoverBg: "#000000",
      buttonHoverText: "#FFFFFF",
      buttonDeleteHoverBg: "#FF0000",
      buttonDeleteHoverText: "#FFFFFF",
    },
    light: {
      containerBg: "#2F2F2F",
      textColor: "#FFFFFF",
      buttonBg: "#3A3A3A",
      buttonText: "#FFFFFF",
      buttonHoverBg: "lightgray",
      buttonHoverText: "#000000",
      buttonDeleteHoverBg: "#FF0000",
      buttonDeleteHoverText: "#FFFFFF",
    },
  };

  const currentStyle = styles[theme];



  return (
    <div className="m-5">
      {loading && <Loader />}
      <div
        className="flex items-center relative z-10 mr-4 ml-4 justify-between rounded-xl h-20 p-4"
        style={{ backgroundColor: currentStyle.containerBg }}
      >
        <div className="flex items-center">
          <Image
            src={badEventsIcon}
            alt="logo"
            className="w-7 h-7"
            style={{
              filter: "invert(100%) sepia(100%) saturate(0%) hue-rotate(200deg)"
            }}
            
          />
          <h1
            className="text-3xl font-medium ml-4"
            style={{ color: currentStyle.textColor }}
          >
            Bad Events
          </h1>
        </div>
        {selectedRow?.length > 0 && (
          <div className="flex space-x-4">
            <button
              className="border px-4 py-2 rounded-lg transition"
              style={{
                backgroundColor: currentStyle.buttonBg,
                color: currentStyle.buttonText,
                borderColor: currentStyle.textColor,
              }}
              onClick={() => handleAction("Move")}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = currentStyle.buttonHoverBg;
                e.target.style.color = currentStyle.buttonHoverText;
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = currentStyle.buttonBg;
                e.target.style.color = currentStyle.buttonText;
              }}
            >
              Move
            </button>
            <button
              className="border px-4 py-2 rounded-lg transition"
              style={{
                backgroundColor: currentStyle.buttonBg,
                color: currentStyle.buttonText,
                borderColor: currentStyle.textColor,
              }}
              onClick={() => handleAction("Delete")}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor =
                  currentStyle.buttonDeleteHoverBg;
                e.target.style.color = currentStyle.buttonDeleteHoverText;
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = currentStyle.buttonBg;
                e.target.style.color = currentStyle.buttonText;
              }}
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {showDeleteConfirmation && (
        <MessageAlert
          type="danger"
          message="Are you sure you want to delete this Event?"
          onClickYes={handleDeleteConfirm}
          onClickNo={() => setShowDeleteConfirmation(false)}
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
  );
  
}