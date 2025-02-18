import React, { useState, useEffect } from "react";
import { fetchApi } from "../../fetchApi";
import { toast } from "react-toastify";
import Image from "next/image";
import { formatDateWithTime } from "../../utils";
import Loader from "../../components/Loader";
import log from "../../assets/images/log.png";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { useRouter } from "next/router";
import inventoryIcon from "../../assets/images/inventory.png";
import ticket from "../../assets/images/ticket.png";
import reportIcon from "../../assets/images/report.png";
import { useTheme } from "../../context/themeContext";
import {
  Box,
  Typography,
  Grid,
  Select,
  MenuItem,
  FormControl,
  CardContent,
  Card,
  InputLabel,
} from "@mui/material";

export async function getServerSideProps(context) {
  const { req } = context;
  const token = req.cookies.ajs_anonymous_id;

  return {
    props: { token },
  };
}

export default function Reports({ token }) {
  const [reportData, setReportData] = useState(null);
  const [eventSections, setEventSections] = useState([]);
  const [listPriceDetails, setListPriceDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dropdownValue, setDropdownValue] = useState("");
  const [pieChartData, setPieChartData] = useState([]);
  const [seatTypeChartData, setSeatTypeChartData] = useState([]);
  const router = useRouter();
  const { eventMappingId } = router.query;
  const { theme } = useTheme();

  const colors = [
    "#212121", // Very Dark Gray
    "#424242", // Dark Gray
    "#37474F", // Blue Gray
    "#263238", // Dark Blue-Gray
    "#1E3A5F", // Dark Slate Blue
    "#102027", // Deep Cyan
    "#3E2723", // Dark Brown
    "#4E342E", // Medium Brown
    "#5D4037", // Brown
    "#283593", // Indigo
    "#1A237E", // Dark Navy Blue
    "#0D47A1", // Dark Blue
    "#1565C0", // Muted Blue
    "#2C3E50", // Dark Steel Blue
    "#212121", // Jet Black
    "#37474F", // Charcoal Gray
    "#546E7A", // Slate Gray
  ];
  const totalQuantity1 = pieChartData.reduce(
    (acc, item) => acc + item.value,
    0
  );
  const totalQuantity2 = seatTypeChartData.reduce(
    (acc, item) => acc + item.totalQuantity,
    0
  );

  const getReportApi = async (eventMappingId) => {
    setLoading(true);
    const [data, error] = await fetchApi({
      method: "GET",
      endPoint: `Reporting/${eventMappingId}`,
      params: { page: 1, limit: 1000 },
      token,
    });
    console.log(data, "data");

    if (error) {
      toast.error(
        error.response ? error?.response?.data?.message : error.message
      );
      setLoading(false);
      return;
    }

    if (data && data.eventDetails) {
      setReportData(data.eventDetails);
      setEventSections(data.eventSections);
      setListPriceDetails(data.listPriceDetails);
    } else {
      toast.error("Unexpected response format from the API.");
    }

    setLoading(false);
  };

  useEffect(() => {
    if (eventMappingId) {
      getReportApi(eventMappingId);
    }
  }, [eventMappingId]);

  const handleDropdownChange = (event) => {
    const selectedSection = event.target.value;
    setDropdownValue(selectedSection);

    const filteredDetails = listPriceDetails.filter(
      (detail) => detail.section === selectedSection
    );

    // Create chart data for list price
    const chartData = filteredDetails.map((detail, index) => ({
      id: index,
      value: detail.totalQuantity,
      label: `List Price $${detail.listPrice.toFixed(2)}`,
      facePrice: detail.facePrice,
      totalQuantity: detail.totalQuantity,
      inventoryCount: detail.inventoryCount,
    }));

    setPieChartData(chartData);

    // Calculate seat type data
    const seatTypeData = {};
    filteredDetails.forEach((detail) => {
      const { seatType, listPrice, totalQuantity, facePrice, inventoryCount } =
        detail;

      if (!seatTypeData[seatType]) {
        seatTypeData[seatType] = {
          value: 0, // Total price for this seat type
          label: `Seat Type: ${seatType}`,
          facePrice: 0, // Aggregate face price
          totalQuantity: 0, // Total quantities for this seat type
          inventoryCount: 0, // Aggregate inventory count
        };
      }

      // Aggregate quantities correctly
      seatTypeData[seatType].totalQuantity += totalQuantity; // Aggregate total quantity
      seatTypeData[seatType].value += listPrice * totalQuantity; // Aggregate list price based on total quantity
      seatTypeData[seatType].facePrice += facePrice * totalQuantity; // Aggregate face price based on total quantity
      seatTypeData[seatType].inventoryCount += inventoryCount; // Aggregate inventory count
    });
    console.log(seatTypeData, "seatTypeData");

    // Convert seatTypeData to array format for chart
    const aggregatedSeatTypeData = Object.values(seatTypeData).map(
      (data, index) => ({
        id: index,
        value: data.value, // Total price for the aggregated seat type
        label: `${data.label}`, // Showing total quantity
        facePrice: data.facePrice,
        totalQuantity: data.totalQuantity, // This should give you the total quantity
        inventoryCount: data.inventoryCount,
      })
    );

    // Assuming you have a state for seat type chart data
    setSeatTypeChartData(aggregatedSeatTypeData);
  };
  const colors1 = {
    background: theme === "light" ? "#2F2F2F" : "#686868",
    text: theme === "light" ? "#FFFFFF" : "#FFFFFF",
    border: theme === "light" ? "#FFFFFF" : "#E0E0E0",
    buttonHover: theme === "light" ? "#FF0000" : "#E0E0E0",
    buttonDeleteHoverBg: "#FF0000",
    buttonDeleteHoverText: "#FFFFFF",
  };
  return (
    <div className="border-collapse m-2 border-gray-600">
      {loading && <Loader />}
      <div className="flex flex-col rounded-lg">
        <div
          className="flex items-center justify-between h-20 relative z-10 p-4"
        >
          <div
            className="flex items-center w-full h-20 bg-[#2F2F2F] rounded-lg p-2"
            style={{ backgroundColor: colors1.background }}
          >
            <Image
              src={reportIcon}
              alt="logo"
              className="w-7 h-7"
              style={{ filter: "invert(100%)" }}
            />
            <h1
              className="text-3xl ml-3 font-medium"
              style={{ color: theme === "light" ? "#fff" : "#fff" }}
            >
              Reports
            </h1>
          </div>
        </div>
        <div
          className="text-4xl font-bold text-[#2F2F2F] mt-8 ml-4 p-3 flex items-center"
          style={{ color: theme === "light" ? "#2F2F2F" : "#fff" }}
        >
          <h1> {reportData ? reportData[0]?.eventName : 0}</h1>
        </div>
        <span className="ml-8 text-xl">
          {reportData ? reportData[0]?.venueName : 0}
        </span>
        <span className="ml-8">
          {reportData && reportData[0]?.eventDate
            ? formatDateWithTime(reportData[0].eventDate)
            : "No Date Available"}
        </span>

        <div className="flex flex-wrap justify-center p-4">
          <Grid container spacing={2}>
            {/* First box */}
            <Grid item xs={12} sm={4} md={3}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                p={3}
                className="rounded-xl"
                sx={{
                  width: "100%",
                  height: 130,
                  backgroundColor: "white",
                  boxShadow: 2,
                }}
              >
                <Image src={inventoryIcon} alt="logo" className="w-12 h-12" />
                <Typography variant="h6" fontWeight="bold" color="text.primary">
                  Total Inventory
                </Typography>
                <Typography variant="h5" fontWeight="bold" color="text.primary">
                  {reportData ? reportData[0]?.totalInventory : 0}
                </Typography>
              </Box>
            </Grid>

            {/* Second box */}
            <Grid item xs={12} sm={4} md={3}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                p={3}
                className="rounded-xl"
                sx={{
                  width: "100%",
                  height: 130,
                  backgroundColor: "white",
                  boxShadow: 2,
                }}
              >
                <Image src={log} alt="logo" className="w-12 h-12" />
                <Typography variant="h6" fontWeight="bold" color="text.primary">
                  Total Logs
                </Typography>
                <Typography variant="h5" fontWeight="bold" color="text.primary">
                  {reportData ? reportData[0]?.totalLogs : 0}
                </Typography>
              </Box>
            </Grid>

            {/* Third box */}
            <Grid item xs={12} sm={4} md={3}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                p={3}
                className="rounded-xl"
                sx={{
                  width: "100%",
                  height: 130,
                  backgroundColor: "white",
                  boxShadow: 2,
                }}
              >
                <Image src={ticket} alt="logo" className="w-14 h-14" />
                <Typography variant="h6" fontWeight="bold" color="text.primary">
                  Total Quantity
                </Typography>
                <Typography variant="h5" fontWeight="bold" color="text.primary">
                  {reportData ? reportData[0]?.totalQuantity : 0}
                </Typography>
              </Box>
            </Grid>

            {/* Fourth box with dropdown */}
            <Grid item xs={12} sm={4} md={3}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                p={3}
                className="rounded-xl"
                sx={{
                  width: "100%",
                  height: 130,
                  backgroundColor: "white",
                  boxShadow: 2,
                }}
              >
                <Typography variant="h6" fontWeight="bold" color="text.primary">
                  Select Section
                </Typography>
                <FormControl variant="outlined" sx={{ minWidth: 120 }}>
                  <InputLabel>Section</InputLabel>
                  <Select
                    value={dropdownValue}
                    onChange={handleDropdownChange}
                    label="Section"
                  >
                    {eventSections.length > 0 &&
                      eventSections.map((section, i) => (
                        <MenuItem key={i} value={section}>
                          {section}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Box>
            </Grid>
          </Grid>
        </div>
      </div>
      <Box
        display="flex"
        justifyContent="center"
        flexDirection="row"
        alignItems="center"
        p={4}
      >
        {/* First Card with Pie Chart */}
        <Card sx={{ width: "50%", height: 500, position: "relative", mx: 1 }}>
          <CardContent>
            <Box display="flex" flexDirection="column" alignItems="center">
              <PieChart width={300} height={300}>
                <Pie
                  data={pieChartData}
                  dataKey="value"
                  nameKey="label"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  innerRadius={60}
                  fill="#8884d8"
                  labelLine={false}
                  label={false}
                >
                  {pieChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={colors[index % colors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>

              {/* Gap between the Pie Chart and Labels */}
              <Box
                mt={2}
                display="flex"
                flexWrap="wrap"
                justifyContent="space-between"
                sx={{
                  maxHeight: "150px",
                  overflowY: "auto",
                  width: "100%",
                }}
              >
                {pieChartData.map((entry, index) => (
                  <Box
                    key={index}
                    sx={{
                      flex: "0 0 30%",
                      display: "flex",
                      alignItems: "center",
                      mb: 1,
                    }}
                  >
                    <Box
                      sx={{
                        width: 16,
                        height: 16,
                        backgroundColor: colors[index % colors.length],
                        borderRadius: "4px",
                        mr: 1,
                      }}
                    />
                    <Typography variant="body2">
                      {entry.label} - {entry.value}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Second Card with Pie Chart */}
        <Card sx={{ width: "50%", height: 500, mx: 1, position: "relative" }}>
          <Box
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              bgcolor: "#2F2F2F",
              color: "white",
              p: 1,
              borderRadius: 1,
              width: "150px",
              height: "40px",
              fontSize: "14px",
              alignItems: "center",
              justifyContent: "center",
              display: "flex",
            }}
          >
            Total Quantity: {totalQuantity2}
          </Box>
          <CardContent>
            <Box display="flex" flexDirection="column" alignItems="center">
              <PieChart width={300} height={300}>
                <Pie
                  data={seatTypeChartData}
                  dataKey="value"
                  nameKey="label"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  innerRadius={60}
                  fill="#8884d8"
                  labelLine={false}
                  label={false}
                >
                  {seatTypeChartData.map((entry, index) => (
                    <Cell fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>

              {/* Gap between the Pie Chart and Labels */}
              <Box
                mt={2}
                display="flex"
                flexWrap="wrap"
                justifyContent="space-between"
                sx={{
                  maxHeight: "150px",
                  overflowY: "auto",
                  width: "100%",
                }}
              >
                {seatTypeChartData.map((entry, index) => (
                  <Box
                    key={index}
                    sx={{
                      flex: "0 0 30%",
                      display: "flex",
                      alignItems: "center",
                      mb: 1,
                    }}
                  >
                    <Box
                      sx={{
                        width: 16,
                        height: 16,
                        backgroundColor: colors[index % colors.length],
                        borderRadius: "4px",
                        mr: 1,
                      }}
                    />
                    <Typography variant="h6">{entry.label}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </div>
  );
}
