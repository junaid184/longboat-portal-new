import React, { useState, useEffect, useRef } from "react";
import { DataGrid, GridToolbarQuickFilter } from "@mui/x-data-grid";
import { Grid, Card, CardContent, Typography, Button, Menu, Box, MenuItem, Select, Modal, TextField, FormControl, IconButton, InputLabel, OutlinedInput, Chip } from "@mui/material";
import orderIcon from "../../assets/images/icons/automatiq.png";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Image from "next/image";
import MessageAlert from "../../components/messageAlert";
import { formatDate, formatDateWithTime, formatDateWithTime1, formatDateWithDay, formatTime } from "../../utils";
import { useTheme } from "../../context/themeContext";
import { GetStatusById, statusList } from "../../utils/constant";
import { handleActionApi, getAutomatiqOrders } from "../../services/orderService";
import { Skeleton } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
export async function getServerSideProps(context) {
  const { req } = context;
  const token = req.cookies.ajs_anonymous_id;

  return {
    props: { token },
  };
}
function QuickSearchToolbar() {
  return (
    <Box sx={{ p: 1.5, pb: 0 }}>
      <GridToolbarQuickFilter />
    </Box>
  );
}
export default function AutomatiqOrders({ token }) {
  const [automatiqOrders, setautomatiqOrders] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const fileInputRef = useRef(null);
  const [anchorEls, setAnchorEls] = useState({});
  const [showMessage, setShowMessage] = useState(false);
  const [seats, setSeats] = useState("");
  const [page, setPage] = useState(0);
  const [currentRow, setCurrentRow] = useState(null);
  const [pageSize, setPageSize] = useState(10);
  const [count, setCount] = useState(0);
  const { theme } = useTheme(); // Access the current theme
  const [orders, setOrders] = useState(automatiqOrders);
  const [selectedStatuses, setSelectedStatuses] = useState([]);


  const handleStatusToggle = (order) => {
    setSelectedOrder(order);
    setOpen(true);
  };


  const handleClose = () => {
    setOpen(false);
    setSeats(""); // Reset seats field
  };

  // Handle Purchase Order Click
  const handlePurchaseOrder = () => {
    console.log("Purchasing Order:", selectedOrder, "Seats:", seats);
    // API Call for purchase can be placed here
    handleClose();
  };

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
    getOrdersApi(setLoading, setautomatiqOrders, token, page, pageSize, setCount);
    setPageSize(newPageSize);
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    console.log(`page change ${newPage}`);
    getOrdersApi(setLoading, setautomatiqOrders, token, page, pageSize, setCount);
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

  const fetchFilteredOrders = async (selectedStatuses) => {
    console.log("Fetching orders with statuses:", selectedStatuses);
    return [
      { id: 1, title: "Order A", status: "confirmed", createdAt: "2024-03-01" },
      { id: 2, title: "Order B", status: "pending", createdAt: "2024-03-02" },
    ].filter((order) => selectedStatuses.includes(order.status));
  };


  // Updated status options
  const statusOptions = ["pending", "problem", "confirmed", "confirmed_delay", "delivery_problem", "delivered"];

  // Handle API call for filtering
  const handleFilter = async () => {
    const filteredData = await fetchFilteredOrders(selectedStatuses);
    setOrders(filteredData);
  };

  // Handle status change in multi-select dropdown
  const handleStatusChange = (event) => {
    setSelectedStatuses(event.target.value);
  };

  const handleRemoveStatus = (statusToRemove) => {
    setSelectedStatuses((prev) => prev.filter((status) => status !== statusToRemove));
  };


  const handleMenuOpen = (event, row) => {
    setAnchorEls((prev) => ({ ...prev, [row.id]: event.currentTarget }));
    setCurrentRow(row);
  };
  useEffect(() => {
    getAutomatiqOrders(setLoading, setautomatiqOrders, token, page, pageSize, setCount);
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
      width: 180,
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
      width: 180,
      headerAlign: "center",
      align: "center",
      valueGetter: (params) => params.row.orderRecivedBy?.userName || "",
    },
    {
      field: "orderFullFilledBy",
      headerName: "FullFilled By",
      width: 180,
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
                    if (status.id === 4) {
                      window.open(
                        "/admin/update-invoice?orderId=" + params.row?.id,
                        "_blank"
                      );
                    }
                    else {
                      await handleMenuAction(status.id, orderId, token, setLoading, setautomatiqOrders, setCount, page, pageSize); // Use orderId here
                      handleMenuClose(); // Close the menu after the action.
                    }
                  }}
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
            Automatiq Orders
          </h1>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </div>
      {/* <div className="relative -mt-10 z-0">
        {loading ? (
          <Skeleton
            variant="rectangular"
            width="100%"
            height={550}
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: 10,
              backgroundColor: theme === 'dark' ? '#D3D3D3' : '#e0e0e0'
            }}
          />
        ) : (
          <Box
            sx={{
              height: "72vh",
              width: "100%",
              backgroundColor: "white",
              borderRadius: "12px",
              boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.2)",
              paddingTop: "32px",
            }}
          >
            <DataGrid
              rows={automatiqOrders}
              columns={columns}
              pageSize={pageSize}
              page={page}
              rowCount={count}
              paginationMode="server"
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              pagination
              disableSelectionOnClick
              checkboxSelection
              rowsPerPageOptions={[10, 50, 100]}
              components={{ Toolbar: QuickSearchToolbar }}
              sx={{
                "& .MuiDataGrid-root": {
                  overflow: "auto",
                },
              }}
            />
          </Box>
        )}
      </div> */}
      <div className="relative -mt-10 z-0">
        {loading ? (
          <Skeleton
            variant="rectangular"
            width="100%"
            height={550}
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: 10,
              backgroundColor: theme === 'dark' ? '#D3D3D3' : '#e0e0e0'
            }}
          />
        ) : (
          <Box
            sx={{
              width: "100%",
              backgroundColor: "white",
              borderRadius: "12px",
              boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.2)",
              padding: "32px",
            }}
          >
            <Grid container spacing={2} marginTop={2} alignItems="center">
              {/* Dropdown & Filter Button in the Same Grid */}
              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    multiple
                    value={selectedStatuses}
                    onChange={handleStatusChange}
                    input={<OutlinedInput label="Status" />}
                    renderValue={(selected) => (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                        {selected.map((value) => (
                          <Chip
                            key={value}
                            label={value}
                            onDelete={() => handleRemoveStatus(value)}
                            deleteIcon={
                              <IconButton size="small">
                                <CancelIcon fontSize="small" />
                              </IconButton>
                            }
                          />
                        ))}
                      </div>
                    )}
                  >
                    {statusOptions.map((status) => (
                      <MenuItem key={status} value={status}>
                        {status}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Filter Button Below the Dropdown */}
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleFilter}
                  fullWidth
                  sx={{ marginTop: 2 }}
                >
                  Filter
                </Button>
              </Grid>
            </Grid>

            <Grid container spacing={2} marginTop={1}>
              {automatiqOrders.map((order) => (
                <Grid item xs={12} key={order.id}>
                  <Card sx={{ display: "flex", padding: 2, alignItems: "center", boxShadow: 3 }}>
                    {/* Left Section - Status Icon and Order ID */}
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", width: "10%" }}>
                      <Typography sx={{ marginTop: 1, fontWeight: "bold" }}>{order.orderId}</Typography>
                      <Box
                        sx={{
                          width: 150,
                          height: 25,
                          backgroundColor: order.status === "confirmed" ? "green" : "orange",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          borderRadius: "4px",
                        }}
                      >
                        <CheckCircleIcon sx={{ fontSize: 16, marginRight: 0.5 }} />
                        {order.status}
                      </Box>
                    </Box>


                    {/* Middle Section - Event Details */}
                    <Box sx={{ flex: 1, paddingLeft: 2}}>
                      <Typography variant="h6" sx={{ fontWeight: "bold", color: "#4490d3" }}>
                        {order.eventName}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        📅 {new Date(order.occursAt).toLocaleDateString()}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" sx={{ display: "flex", alignItems: "center" }}>
                        <LocationOnIcon sx={{ fontSize: 18, marginRight: 0.5, color: "#cd0d0d8a" }} />
                        {order.venueName}
                      </Typography>
                    </Box>

                    {/* Right Section - Price and Order Date */}
                    <Box
                      sx={{
                        textAlign: "center",
                        width: "5%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <PhoneAndroidIcon sx={{ fontSize: 15, marginBottom: 0.5 }} />
                      <Typography sx={{ textTransform: "uppercase" }}>
                        {order.delivery}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: "right", width: "10%" }}>
                      <Typography>
                        Section: {order.section}
                      </Typography>
                      <Typography>
                        Row: {order.row}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: "right", width: "12%" }}>
                      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        ${order.unitPrice}
                      </Typography>
                      <Typography>
                        {order.quantity} x {order.unitPrice}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", width: "15%" }}>
                      <Typography variant="body2" color="textSecondary">
                        Order Date
                      </Typography>
                      <Typography variant="body2">
                        {formatDateWithDay(order.orderDate)} {formatTime(order.orderDate)}
                      </Typography>
                    </Box>

                    {/* Confirm Order Button */}
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ marginLeft: 2 }}
                      onClick={() => handleStatusToggle(order)}
                    >
                      Confirm Order
                    </Button>
                  </Card>
                </Grid>
              ))}
            </Grid>
            <Modal open={open} onClose={handleClose}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 2,
                  width: "50%",
                  margin: "10% auto",
                  backgroundColor: "white",
                  padding: 3,
                  borderRadius: "12px",
                  boxShadow: 24,
                }}
              >
                {/* Left Side: Seat Input */}
                <Box flex={1} display="flex" flexDirection="column" gap={2}>
                  <Typography variant="h6">Confirm Order</Typography>
                  <TextField
                    type="text"
                    label="Number of Seats"
                    variant="outlined"
                    value={seats}
                    onChange={(e) => setSeats(e.target.value)}
                    fullWidth
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handlePurchaseOrder}
                    disabled={!seats}
                  >
                    Purchase Order
                  </Button>
                </Box>

                {/* Right Side: Order Details (Confirmation Slip) */}
                {selectedOrder && (
                  <Box flex={1} sx={{ backgroundColor: "#f5f5f5", padding: 2, borderRadius: "8px" }}>
                    <Typography variant="h6">Confirmation Slip</Typography>
                    <Typography variant="body1">
                      <strong>Order:</strong> {selectedOrder.title}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Status:</strong> {selectedOrder.status}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Created At:</strong>{" "}
                      {new Date(selectedOrder.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Modal>
          </Box>
        )}
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