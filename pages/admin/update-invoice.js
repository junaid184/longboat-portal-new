import React, { useState, useEffect } from "react";
import MuiGridDynamic from "../../components/MuiGrid";
import { fetchApi } from "../../fetchApi";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import {formatDateWithTime} from "../../utils";
import { useTheme } from "../../context/themeContext";
import {updateInvoice} from "../../services/orderService";

export async function getServerSideProps(context) {
  const { req } = context;
  const token = req.cookies.ajs_anonymous_id;

  return {
    props: { token },
  };
}

export default function Invoice({ token }) {
  const [invoice, setInvoice] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [Count, setCount] = useState(0);
  const [orders, setOrders] = useState([]);
  const [accountData, setAccountData] = useState(null);
  const [showAccountTable, setShowAccountTable] = useState(false);
  const { orderId } = router.query;
  const { theme } = useTheme();

  const handleGenerateAccount = async () => {
    setLoading(true);

    try {
      const [response, error] = await fetchApi({
        method: "GET",
        endPoint: "BuyingAccount/RandomAccount",
        params: { page: 1, pageSize: 1 },
        token: token,
      });

      if (error) {
        throw new Error(
          error.response?.data?.message ||
            "An error occurred while fetching the account."
        );
      }

      if (response?.data) {
        const account = response.data;
        if (account) {
          setAccountData(account);
          setShowAccountTable(true);
        } else {
          throw new Error("No account data found.");
        }
      } else {
        throw new Error("Invalid response format from the server.");
      }
    } catch (err) {
      console.error(err);
      toast.error(
        err.message || "Something went wrong while fetching the account."
      );
    } finally {
      setLoading(false);
    }
  };
  const [dataToUpdate, setDataToUpdate] = useState();
  const fetchLogs = async (orderId) => {
    setLoading(true);

    try {
      const [response, error] = await fetchApi({
        method: "GET",
        endPoint: `order/bySkybox?orderId=${orderId}`,
        token,
      });

      setLoading(false);

      if (error) {
        toast.error(
          error.response ? error.response.data.message : error.message
        );
        return;
      }

      if (response?.data?.response) {
        const parsedResponse = JSON.parse(response.data.response);
        let cost = parsedResponse.inventory?.cost;
        let qty = parsedResponse.inventory?.quantity;
        let unitCost = cost / qty;
        setDataToUpdate(parsedResponse);
        const invoice = [
          {
            ...parsedResponse,
            id: parsedResponse.id,
            description: parsedResponse.description,
            accountId: parsedResponse.accountId,
            status: parsedResponse.inventory?.status,
            seats: `${parsedResponse.inventory?.lowSeat}-${parsedResponse.inventory?.highSeat}`,
            row: parsedResponse.inventory?.row,
            section: parsedResponse.inventory?.section,
            quantity: parsedResponse.inventory?.quantity,
            eventName: parsedResponse.inventory?.eventMapping?.eventName,
            venueName: parsedResponse.inventory?.eventMapping?.venueName,
            eventDate: parsedResponse.inventory?.eventMapping?.eventDate,
            inHandDate: parsedResponse.inventory?.inHandDate,
            unitCost: unitCost,
            totalCost: parsedResponse.inventory?.cost,
            targetId: parsedResponse?.targetId,
          },
        ];

        setInvoice(invoice);
        toast.success("Invoice fetched successfully.");
      } else {
        toast.error("Unexpected response format from the API.");
      }
    } catch (error) {
      setLoading(false);
      toast.error(error.message || "Failed to fetch logs.");
    }
  };

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  useEffect(() => {
    if (orderId) {
      // Ensure orderId is available before fetching logs
      fetchLogs(orderId);
    }
  }, [orderId]); // Call the effect when eventId changes

  const columns = [
    {
      field: "id",
      headerName: "Line ID",
      width: 150,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <div className="flex items-center justify-center w-80 space-x-4">
          <span>{params.row.id}</span>
        </div>
      ),
    },
    {
      field: "accountId",
      headerName: "PO #",
      width: 150,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <div className="flex items-center justify-center w-80 space-x-4">
          <span>{params.row.accountId}</span>
        </div>
      ),
    },
    {
      field: "eventName",
      headerName: "Event",
      width: 180,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <div className="flex items-center justify-center w-80 space-x-4">
          <span>{params.row.eventName}</span>
        </div>
      ),
    },
    {
      field: "venueName",
      headerName: "Venue",
      width: 220,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <div className="flex items-center justify-center w-80 space-x-4">
          <span>{params.row.venueName}</span>
        </div>
      ),
    },
    {
      field: "eventDate",
      headerName: "Date-Time",
      width: 200,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => formatDateWithTime(params.row.eventDate),
    },
    {
      field: "seats",
      headerName: "Seats",
      width: 180,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <div className="flex items-center justify-center w-80 space-x-4">
          <span>{params.row.seats}</span>
        </div>
      ),
    },
    {
      field: "row",
      headerName: "Row",
      width: 180,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <div className="flex items-center justify-center w-80 space-x-4">
          <span>{params.row.row}</span>
        </div>
      ),
    },
    {
      field: "section",
      headerName: "Section",
      width: 120,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <div className="flex items-center justify-center w-80 space-x-4">
          <span>{params.row.section}</span>
        </div>
      ),
    },
    {
      field: "quantity",
      headerName: "Qty",
      width: 120,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <div className="flex items-center justify-center w-80 space-x-4">
          <span>{params.row.quantity}</span>
        </div>
      ),
    },
    {
      field: "unitCost",
      headerName: "Unit Cost",
      width: 120,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <div className="flex items-center justify-center w-80 space-x-4">
          <span>{params.row.unitCost}</span>
        </div>
      ),
    },
    {
      field: "totalCost",
      headerName: "Total Cost",
      width: 150,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        const handleChange = (event) => {
          const newTotalCost = parseFloat(event.target.value) || 0;
          const quantity = params.row.quantity || 1;
  
          // Calculate the new unit cost
          const newUnitCost = quantity > 0 ? newTotalCost / quantity : 0;
  
          // Update totalCost and unitCost in the grid
          setDataToUpdate({
            ...dataToUpdate,
            inventory:{
              ...dataToUpdate.inventory,
              cost: newTotalCost,
            }
            
          })
          params.api.updateRows([
            {
              id: params.row.id,
              totalCost: newTotalCost,
              unitCost: newUnitCost,
            },
          ]);
        };
  
        return (
          <input
            type="number"
            value={params.row.totalCost || ""}
            onChange={handleChange}
            className="w-28 p-2 border rounded"
          />
        );
      },
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
  const updateInvoiceFunc = async (data)=>{
    console.log(data);
    const poLineId = data.id.toString();
    const poId = data?.targetId.toString();
    console.log(poId, 'po id');
    const integerOrder = parseInt(orderId);
    const response = await updateInvoice(dataToUpdate, poId, poLineId, integerOrder, token);
  }
  return (
    <div className="border-collapse m-5">
      {invoice.map((log) => (
        <div
          key={log.id}
          className="flex relative mr-4 ml-4 z-10 justify-between items-center rounded-xl h-36 bg-[#2F2F2F] p-4"
          style={{ backgroundColor: "#2F2F2F" }}
        >
          {/* Left Section - Order Details */}
          <div className="text-white">
            <h2 className="text-lg font-semibold">Order ID: {orderId}</h2>
            <p className="text-sm">Invoice ID: {log.id}</p>
            <p className="text-sm">QTY: {log.quantity}</p>
            <p className="text-sm">
              Description: {log.eventName}, {log.venueName}, {log.eventDate}
              <br />
              Section: {log.section}, Row: {log.row}, Seats: {log.seats}
            </p>
          </div>

          {/* Right Section - Buttons */}
          <div className="flex space-x-4">
            <button
              className="px-4 py-4 bg-gray-700 text-white rounded-lg hover:bg-gray-950 mt-14"
              onClick={() => {
                const tmUrl = `https://www.ticketmaster.com/event/${log.id}`;
                window.open(tmUrl, "_blank");
                console.log(`Button 1 Clicked for Order ID: ${log.id}`);
              }}
            >
              Open TM URL
            </button>

            <button
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-950 mt-14"
              onClick={() => {
                console.log(`Button 2 Clicked for Order ID: ${log.id}`);
                updateInvoiceFunc(invoice[0]);
              }}
            >
              Update Invoice PO
            </button>
          </div>
        </div>
      ))}
      <div
        className="relative -mt-10 z-0"
        style={{ display: "flex", flexDirection: "column", height: "240px" }}
      >
        <MuiGridDynamic
          data={invoice || []}
          columns={columns}
          loading={loading}
          sx={{ flex: 1 }} 
        />
      </div>
      <div className="flex justify-center items-center mt-4">
          <button
            className="px-4 py-4 bg-gray-700 text-white rounded-lg hover:bg-gray-950"
            onClick={handleGenerateAccount}
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate Account"}
          </button>
        </div>
      {showAccountTable && accountData && (
        <div className="mt-5">
          <table className="min-w-full table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2 border">Field</th>
                <th className="px-4 py-2 border">Value</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(accountData).map(([key, value]) => (
                <tr key={key}>
                  <td className="px-4 py-2 border">{key}</td>
                  <td className="px-4 py-2 border">
                    {value !== null ? value.toString() : "null"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}