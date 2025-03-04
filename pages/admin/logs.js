import React, { useState, useEffect } from "react";
import MuiGridDynamic from "../../components/MuiGrid";
import { fetchApi } from "../../fetchApi";
import { toast } from "react-toastify";
import log from "../../assets/images/log.png";
import { useRouter } from "next/router";
import { formatDate } from "../../utils";
import { Box , TextField , Button } from "@mui/material";
import Image from "next/image";
import { useTheme } from "../../context/themeContext";
import { Skeleton } from "@mui/material";

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
export default function Logs({ token }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const { eventId } = router.query;
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    section: "",
    row: "",
    eventDate: "",
  });
  
  // Handle input field changes
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  
  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent unexpected behavior
  
    const { section, row, eventDate } = formData;
    try {
      setLoading(true);
  
      const [response, error] = await fetchApi({
        method: "GET",
        endPoint: `logs/eventId?id=${eventId}`,
        params: { section, row, date: eventDate },
      });
  
      setLoading(false);
  
      if (error) {
        toast.error("Error fetching logs.");
        return;
      }
  
      console.log("API Response:", response);
  
      if (response?.data) {
        const logs = response.data.map((log) => ({
          ...log,
          id: log.logId, // Assign unique ID
        }));
        setLogs(logs);
      } else {
        toast.error("Unexpected response format from the API.");
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      toast.error("An error occurred while fetching logs.");
    }
  };
  
  // Reset the form
  const handleReset = () => {
    setFormData({ section: "", row: "", eventDate: "" });
    fetchLogs(eventId);
  };

  const fetchLogs = async (eventId) => {
    setLoading(true);
    
    const [response, error] = await fetchApi({
      method: "GET",
      endPoint: `logs/eventId?id=${eventId}`, // Correct endpoint
      token,
    });
  
    setLoading(false);
  
    if (error) {
      toast.error(
        error.response ? error.response.data.message : error.message
      );
      return;
    }
  
    // Correctly handle the response structure
    if (response?.data) {
      const logs = response.data.map((log) => ({
        ...log,
        id: log.logId, // Use logId as the unique identifier
      }));
      setLogs(logs);
    } else {
      toast.error("Unexpected response format from the API.");
    }
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

  useEffect(() => {
    if (eventId) {
      // Ensure eventId is available before fetching logs
      fetchLogs(eventId);
    }
  }, [eventId]); // Call the effect when eventId changes

  const columns = [
    {
      field: "logId",
      headerName: "Log ID",
      width: 150,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <div className="flex items-center justify-center w-80 space-x-4">
          <span>{params.row.logId}</span>
        </div>
      ),
    },
    {
      field: "setupEventId",
      headerName: "EventID",
      width: 150,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <div className="flex items-center justify-center w-80 space-x-4">
          <span>{params.row.setupEventId}</span>
        </div>
      ),
    },
    {
      field: "action",
      headerName: "Action",
      width: 120,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <div className="flex items-center justify-center w-80 space-x-4">
          <span>{params.row.action}</span>
        </div>
      ),
    },
    {
      field: "response",
      headerName: "Response",
      width: 240,
      headerAlign: "center",
      align: "left",
      renderCell: (params) => (
        <div
          className='flex items-center justify-start w-100 space-x-4 overflow-x-auto'
          style={{
            whiteSpace: 'nowrap',
            overflowX: 'auto',
            textOverflow: 'ellipsis',
            height: '56px',
            lineHeight: '1', 
            
            overflowY: 'hidden', 
          }}
        >
          <span>{params.row.response}</span>
        </div>
      ),
    },
    {
      field: "responseCode",
      headerName: "Response Code",
      width: 150,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <div className="flex items-center justify-center w-80 space-x-4">
          <span>{params.row.responseCode}</span>
        </div>
      ),
    },
    {
      field: "createdAt",
      headerName: "Log Date / Time",
      width: 200,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => formatDate(params.row.createdAt),
    },
    {
      field: "isActive",
      headerName: "Active",
      width: 120,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <div className="w-28 h-10 flex justify-center items-center">
          {params.row.isActive ? (
            <span className="rounded-2xl text-blue-500">Yes</span>
          ) : (
            <span className="rounded-2xl font-bold text-red-500">No</span>
          )}
        </div>
      ),
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
      <div className="border-collapse m-5">
        <h1 className ="text-xl ml-5">Logs Filtered by Event Details</h1>
         {/* Input Fields & Buttons */}
         <div className="bg-gray-50 p-4 shadow-lg h-24 rounded-lg flex space-x-4 mb-4">
          <TextField
            label="Section"
            variant="outlined"
            name="section"
            value={formData.section}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Row"
            variant="outlined"
            name="row"
            value={formData.row}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Event Date"
            variant="outlined"
            name="eventDate"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={formData.eventDate}
            onChange={handleChange}
            fullWidth
          />
          <Button variant="contained" className="bg-gray-600 w-60 h-12 mt-2 hover:bg-gray-900" onClick={handleSubmit}>
            Apply
          </Button>
          <Button variant="contained" className="bg-gray-600 w-60 h-12 mt-2 hover:bg-gray-900" onClick={handleReset}>
            Reset
          </Button>
        </div>
        {/* Header Section */}
        <div
          className="flex relative mr-4 ml-4 z-10 justify-between rounded-xl h-20 bg-[#2F2F2F]"
          style={{ backgroundColor: colors.background }}
        >
          <div className="flex items-center">
            <Image
              src={log}
              alt="logo"
              className="w-11 h-8 ml-2"
              style={{
                filter: "invert(100%) sepia(100%) saturate(0%) hue-rotate(200deg)",
              }}
            />
            <h1 className="text-3xl font-medium text-white p-2">Logs</h1>
          </div>
        </div>
        {/* Data Grid */}
        <div className="relative -mt-10 z-0">
        {loading ? (
          // <div className="border border-gray-300 rounded-lg p-2">
          <Skeleton
            variant="rectangular"
            width="100%"
            height={550} // Adjust height as needed
            sx={{backgroundColor: theme === 'dark' ? '#D3D3D3' : '#e0e0e0'}}
          />
          // </div>
        ) : (
          <MuiGridDynamic data={logs || []} columns={columns} loading={loading} />
        )}
        </div>
      </div>
    );
}
 