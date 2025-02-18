import React, { useState, useEffect, useRef } from "react";
import MuiGridNew from "../../components/MuiGridNew";
import { fetchApi } from "../../fetchApi";
import { toast } from "react-toastify";
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
import orderIcon from "../../assets/images/icons/order.png";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Image from "next/image";
import MessageAlert from "../../components/messageAlert";
import { formatDate, formatDateWithTime } from "../../utils";
import { RiFolderUploadFill } from "react-icons/ri";
import StylishButton from "../../components/StylishButton";
import Loader from "../../components/Loader";
import { useTheme } from "../../context/themeContext";
import { GetStatusById, statusList } from "../../utils/constant";
import { handleActionApi, getOrdersApi } from "../../services/orderService";

export async function getServerSideProps(context) {
  const { req } = context;
  const token = req.cookies.ajs_anonymous_id;

  return {
    props: { token },
  };
}
export default function Orders({ token }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const [anchorEls, setAnchorEls] = useState({});
  const [showMessage, setShowMessage] = useState(false);
  const [page, setPage] = useState(0);
  const [currentRow, setCurrentRow] = useState(null);
  const [pageSize, setPageSize] = useState(10);
  const [count, setCount] = useState(0);
  const { theme } = useTheme(); // Access the current theme

  const handleMenuAction = async (statusId, orderId, token, setLoading, setOrders, setCount, page = 1, pageSize = 10) => {
    try {
  
      const response = await handleActionApi(statusId, orderId, token);
  
      // Check if the response indicates success
      if (response?.data) {
        // Fetch the updated order list
        if (setLoading) setLoading(true);
        await getOrdersApi(setLoading, setOrders, token, page, pageSize, setCount);
        console.log("Orders list updated successfully.");
      } else {
        console.warn(`Failed to update status for OrderId "${orderId}".`);
      }
  
      return response;
    } catch (error) {
      console.error(
        `Error updating statusId "${statusId}" for OrderId "${orderId}":`,
        error
      );
      return null;
    }
  };
  
  
  const handlePageSizeChange = (newPageSize) => {
    console.log(`page size ${newPageSize}`);
    getOrdersApi(setLoading, setOrders, token, page, pageSize, setCount);
    setPageSize(newPageSize);
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    console.log(`page change ${newPage}`);
    getOrdersApi(setLoading, setOrders, token, page, pageSize, setCount);
    setPage(newPage);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    console.log(file, "file");
    setShowMessage(true); // Show confirmation dialog
  };

  const handleMenuClose = () => {
    setAnchorEls({});
    setCurrentRow(null);
  };

  const handleMenuOpen = (event, row) => {
    setAnchorEls((prev) => ({ ...prev, [row.id]: event.currentTarget }));
    setCurrentRow(row);
  };
  useEffect(() => {
    getOrdersApi(setLoading, setOrders, token, page, pageSize, setCount);
  }, [page, pageSize]);

  const columns = [
    {
      field: "orderId",
      headerName: "Order Id",
      width: 70,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "invoiceId",
      headerName: "Invoice Id",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "orderFulfillmentStatus",
      headerName: "Status",
      width: 150,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        return <span>{GetStatusById(params.row.orderFulfillmentStatus)}</span>;
      },
    },
    {
      field: "orderRecievedDateTime",
      headerName: "Recieved Date-Time",
      width: 150,
      headerAlign: "center",
      align: "center",
      valueGetter: (params) => {
        return params.row.orderRecievedDateTime
          ? formatDateWithTime(params.row.orderRecievedDateTime)
          : "N/A";
      },
    },
    {
      field: "orderRecivedBy",
      headerName: "Assign To",
      width: 120,
      headerAlign: "center",
      align: "center",
      valueGetter: (params) => params.row.orderRecivedBy?.userName || "",
    },
    {
      field: "orderFullFilledBy",
      headerName: "FullFilled By",
      width: 120,
      headerAlign: "center",
      align: "center",
      valueGetter: (params) => params.row.orderFullFilledBy?.userName || "",
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
      field: "invoiceDate",
      headerName: "Invoice Date-Time",
      width: 200,
      headerAlign: "center",
      align: "center",
      valueGetter: (params) => {
        return params.row.invoiceDate
          ? formatDateWithTime(params.row.invoiceDate)
          : "N/A";
      },
    },
    {
      field: "eventDate",
      headerName: "eventDate",
      width: 120,
      headerAlign: "center",
      align: "center",
      valueGetter: (params) => {
        return params.row.eventDate ? formatDate(params.row.eventDate) : "N/A";
      },
    },
    {
      field: "sec",
      headerName: "Sections",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "row",
      headerName: "Row",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "seats",
      headerName: "Seats",
      width: 100,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "qty",
      headerName: "Quantity",
      width: 120,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "unitCost",
      headerName: "Unit Cost",
      width: 120,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "totalCost",
      headerName: "Total Cost",
      width: 120,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "total",
      headerName: "Total",
      width: 120,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "action",
      headerName: "Status",
      width: 150,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        const open = Boolean(anchorEls[params.row.id]);
        const orderId = params.row.id; // Extract orderId from row data
    
        // Option 2: Use statusMapping for quick lookup
        const statusMapping = {
          0: "Draft",
          1: "Pending",
          2: "Completed",
          3: "Report NLA"
        };
        const currentStatus = statusMapping[params.row.orderFulfillmentStatus] || "Select Status";
    
        return (
          <div>
            <Button
              variant="outlined"
              size="small"
              onClick={(event) => handleMenuOpen(event, params.row)}
              endIcon={<ArrowDropDownIcon />}
              sx={{
                color: "#2F2F2F",
                borderColor: "#2F2F2F",
                "&:hover": {
                  borderColor: "#2F2F2F",
                  backgroundColor: "#e0e0e0",
                },
              }}
            >
              {currentStatus}
            </Button>
    
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
              {statusList.map((status) => (
                <MenuItem
                  key={status.id}
                  onClick={async () => {
                    if(status.id === 4){
                      window.open(
                        "/admin/update-invoice?orderId=" + params.row?.id,
                        "_blank"
                      );
                    }
                    else{
                    await handleMenuAction(status.id, orderId, token , setLoading, setOrders, setCount, page, pageSize); // Use orderId here
                    handleMenuClose(); // Close the menu after the action.
                  }}}
                >
                  {status.label}
                </MenuItem>
              ))}
            </Menu>
          </div>
        );
      },
    }
    
  ];
  const colors = {
    background: theme === "light" ? "#2F2F2F" : "#686868",
    text: theme === "light" ? "#FFFFFF" : "#FFFFFF",
    border: theme === "light" ? "#FFFFFF" : "#E0E0E0",
    buttonHover: theme === "light" ? "#FF0000" : "#E0E0E0",
    buttonDeleteHoverBg: "#FF0000",
    buttonDeleteHoverText: "#FFFFFF",
  };
  return (
    <div className="border-collapse m-5 border-gray-600">
      {loading && <Loader />}
      <div
        className="flex items-center relative z-10 mr-3 ml-3 justify-between rounded-xl h-20 bg-[#2F2F2F] p-4"
        style={{ backgroundColor: colors.background }}
      >
        <div className="flex items-center space-x-3">
          <Image
            src={orderIcon}
            alt="logo"
            className="w-7 h-7"
            style={{ filter: "invert(100%)" }}
          />
          <h1
            className="text-3xl font-medium"
            style={{ color: theme === "light" ? "#fff" : "#fff" }}
          >
            Orders
          </h1>
        </div>

        {/* <StylishButton onClick={() => fileInputRef.current.click()}>
          <RiFolderUploadFill
            style={{
              fontSize: "1.5rem",
              fontWeight: "bolder",
              marginRight: "2px",
            }}
          />
          Bulk Upload
        </StylishButton> */}

        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }} // Hide the file input
          onChange={handleFileChange} // Set file on change
        />
      </div>
      <div className="relative -mt-10 z-0">
        <MuiGridNew
          rows={orders}
          columns={columns}
          loading={loading}
          onPageChange={handlePageChange}
          totalCount={count}
          onPageSizeChange={handlePageSizeChange}
        />
      </div>
      {showMessage && (
        <MessageAlert
          type="normal"
          onClickYes={handleYes}
          onClickNo={handleNo}
        />
      )}
    </div>
  );
}
