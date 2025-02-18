import React, { useState, useEffect } from "react";
import { DataGrid, GridToolbarQuickFilter } from "@mui/x-data-grid";
import { Box, CircularProgress, Typography } from "@mui/material";
import Image from "next/image";
import Loader from "../../components/Loader";
import inventoryIcon from "../../assets/images/inventory.png";
import axios from "axios";
import { formatDateWithTime, formatDate } from "../../utils";
import { useTheme } from "../../context/themeContext";

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
const DataGridWithPagination = ({ token }) => {
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();
  const [totalCount, setTotalCount] = useState(0);

  const fetchData = async (token, currentPage, currentPageSize) => {
    setLoading(true); // Start loading state
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BaseURL}/api/inventory/filter`,
        { page: currentPage + 1, pageSize: currentPageSize },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      // Ensure data structure is correct
      if (Array.isArray(response.data?.data?.data)) {
        const updatedRows = response.data.data.data.map((row) => ({
          ...row,
          id: row.inventoryId,
        }));
        setRows(updatedRows);
        setTotalCount(response.data?.data?.count || 0);
      } else {
        console.error("Unexpected API response structure:", response.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // End loading state
    }
  };
  
  // Effect to fetch data when page or page size changes
  useEffect(() => {
    fetchData(token, page, pageSize);
  }, [token, page, pageSize]);
  
  // Handle page size change
  const handlePageSizeChange = (newPageSize) => {
    setLoading(true); // Trigger loading state for page size change
    setPageSize(newPageSize);
    fetchData(token, page, newPageSize); // Use the new page size directly
  };
  
  // Handle page change
  const handlePageChange = (newPage) => {
    setLoading(true); // Trigger loading state for page change
    setPage(newPage);
    fetchData(token, newPage, pageSize); // Use the new page directly
  };
  
  
  const columns = [
    {
      field: "inventoryId",
      headerName: "# ID",
      width: 70,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <div className="flex items-center justify-center w-80 space-x-4">
          <span>{params.row.inventoryId}</span>
        </div>
      ),
    },
    {
      field: "eventName",
      headerName: "Event Name",
      width: 180,
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
      field: "eventDate",
      headerName: "Event Date",
      width: 200,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => formatDateWithTime(params.row.eventDate),
    },
    {
      field: "eventId",
      headerName: "Event Id",
      width: 150,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => <span>{params.row.eventId}</span>,
    },
    {
      field: "tmEventId",
      headerName: "TM EventId",
      width: 150,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => <span>{params.row.tmEventId}</span>,
    },
    {
      field: "quantity",
      headerName: "Quantity",
      width: 100,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => <span>{params.row.quantity}</span>,
    },
    {
      field: "section",
      headerName: "Section",
      width: 180,
      headerAlign: "center",
      align: "center",
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
          <span>{params.row.section}</span>
        </div>
      ),
    },
    {
      field: "row",
      headerName: "Row",
      width: 120,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => <span>{params.row.row}</span>,
    },
    {
      field: "seats",
      headerName: "Seats",
      width: 280,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => <span>{params.row.seats}</span>,
    },
    {
      field: "lowSeat",
      headerName: "Low Seats",
      width: 120,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => <span>{params.row.lowSeat}</span>,
    },
    {
      field: "highSeat",
      headerName: "High Seat",
      width: 150,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => <span>{params.row.highSeat}</span>,
    },
    {
      field: "internalNotes",
      headerName: "Internal Notes",
      width: 150,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => <span>{params.row.internalNotes}</span>,
    },
    {
      field: "publicNotes",
      headerName: "Public Notes",
      width: 150,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => <span>{params.row.publicNotes}</span>,
    },
    {
      field: "tags",
      headerName: "Tags",
      width: 150,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => <span>{params.row.tags}</span>,
    },
    {
      field: "listPrice",
      headerName: "List Price",
      width: 150,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => <span>{params.row.listPrice}</span>,
    },
    {
      field: "facePrice",
      headerName: "Face Price",
      width: 150,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => <span>{params.row.facePrice}</span>,
    },
    {
      field: "taxedCost",
      headerName: "Taxed Cost",
      width: 150,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => <span>{params.row.taxedCost}</span>,
    },
    {
      field: "hideSeats",
      headerName: "Hide Seats",
      width: 120,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <div className="w-28 h-10 flex justify-center items-center">
          {params.row.hideSeats == "Y" ? (
            <span className="rounded-2xl text-blue-500">Yes</span>
          ) : (
            <span className="rounded-2xl font-bold text-red-500">No</span>
          )}
        </div>
      ),
    },
    {
      field: "inHandDate",
      headerName: "In Hand Date",
      width: 150,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => formatDate(params.row.inHandDate),
    },
    {
      field: "instantTransfer",
      headerName: "Instant Transfer",
      width: 120,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <div className="w-28 h-10 flex justify-center items-center">
          {params.row.instantTransfer == "Y" ? (
            <span className="rounded-2xl text-blue-500">Yes</span>
          ) : (
            <span className="rounded-2xl font-bold text-red-500">No</span>
          )}
        </div>
      ),
    },
    {
      field: "splitType",
      headerName: "Split Type",
      width: 150,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => <span>{params.row.splitType}</span>,
    },
    {
      field: "customSplit",
      headerName: "Custom Split",
      width: 150,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => <span>{params.row.customSplit}</span>,
    },
    {
      field: "stockType",
      headerName: "Stock Type",
      width: 150,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => <span>{params.row.stockType}</span>,
    },
    {
      field: "zone",
      headerName: "Zone",
      width: 120,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <div className="w-28 h-10 flex justify-center items-center">
          {params.row.zone == "Y" ? (
            <span className="rounded-2xl text-blue-500">Yes</span>
          ) : (
            <span className="rounded-2xl font-bold text-red-500">No</span>
          )}
        </div>
      ),
    },

    {
      field: "seatType",
      headerName: "Seat Type",
      width: 150,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => <span>{params.row.seatType}</span>,
    },
    {
      field: "ticketStatus",
      headerName: "Ticket Status",
      width: 150,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => <span>{params.row.ticketStatus}</span>,
    },
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
      {/* Header section */}
      <div
        className="relative z-10 flex items-center justify-between rounded-xl h-20 bg-[#2F2F2F] p-4 mr-4 ml-4"
        style={{ backgroundColor: colors.background }}
      >
        <div className="flex items-center">
          <Image
            src={inventoryIcon}
            alt="logo"
            className="w-8 h-8"
            style={{
              filter:
                "invert(100%) sepia(100%) saturate(0%) hue-rotate(200deg)",
            }}
          />
          <h1 className="text-3xl font-medium text-white ml-4">
            Inventory List
          </h1>
        </div>
      </div>

      {/* DataGrid directly without loading condition */}
      <div className="relative -mt-10 z-0">
        <Box
          sx={{
            height: "72vh",
            width: "100%", // Keep the width at 100%
            backgroundColor: "white",
            borderRadius: "12px",
            boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.2)",
            paddingTop: "32px",
          }}
        >
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={pageSize}
            page={page}
            rowCount={totalCount}
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

          {/* Optional: Display total records */}
          {/* <Typography variant="body2" sx={{ marginTop: 2 }}>
          Total records: {totalCount}
        </Typography> */}
        </Box>
      </div>
    </div>
  );
};

export default DataGridWithPagination;
