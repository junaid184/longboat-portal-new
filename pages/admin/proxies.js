import React, { useState, useEffect, useRef } from "react";
import MuiGridNew from "../../components/MuiGridNew";
import { fetchApi } from "../../fetchApi";
import { toast } from "react-toastify";
import { Button } from "@mui/material";
import proxiIcon from "../../assets/images/proxy.png";
import Image from "next/image";
import MessageAlert from "../../components/messageAlert";
import { formatDate, formatDateWithTime } from "../../utils";
import { RiFolderUploadFill } from "react-icons/ri";
import StylishButton from "../../components/StylishButton";
import Loader from '../../components/Loader';
import { useTheme } from "../../context/themeContext";


export async function getServerSideProps(context) {
  const { req } = context;
  const token = req.cookies.ajs_anonymous_id;

  return {
    props: { token },
  };
}
export default function Proxies({ token }) {
  const [proxies, setproxies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const [showMessage, setShowMessage] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [count, setCount] = useState(0);
  const { theme } = useTheme(); // Access the current theme

  const getProxiApi = async (setLoading, setProxies, token, page = 1, pageSize = 10, setCount) => {
    setLoading(true);
  
    try {
      const [response, error] = await fetchApi({
        method: "POST",
        endPoint: "proxy/filter",
        data: { page : page + 1, pageSize },
        token,
      });
  
      setLoading(false);
  
      if (error) {
        throw new Error(
          error.response?.data?.message || "An error occurred while fetching proxies."
        );
      }
  
  if (response?.data) {
    const responseData = response.data;
  
    // Correct the path to the data array
    const proxiesWithIds = Array.isArray(responseData.data)
      ? responseData.data.map((proxy) => ({
          ...proxy,
          id: proxy.proxyId || proxy.uniqueId || proxy.id, // Fallback to ensure unique ID
        }))
      : [];
  
    // Update state with proxies and count if provided
    setCount(responseData.count || 0);
    setProxies(proxiesWithIds);
  } else {
    throw new Error("Invalid response format from the server.");
  }
   } catch (err) {
      setLoading(false);
      toast.error(err.message || "Something went wrong while fetching proxies.");
    }
  };

  const handlePageSizeChange = (newPageSize) => {
    console.log(`page size ${newPageSize}`);
    getProxiApi(setLoading, setproxies, token, page, pageSize, setCount);
    setPageSize(newPageSize);
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    console.log(`page change ${newPage}`);
    getProxiApi(setLoading, setproxies, token, page, pageSize, setCount);
    setPage(newPage);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    console.log(file, "file");
    setShowMessage(true); // Show confirmation dialog
  };

  const handleYes = async () => {
    setShowMessage(false);
    if (selectedFile) {
      // Prepare FormData
      const formData = new FormData();
      formData.append("file", selectedFile);

      // Send the file to the server
      const [response, error] = await fetchApi({
        method: "POST",
        endPoint: "proxy/bulkupload",
        data: formData,
        token,
        isFormData: true,
      });

      if (error) {
        console.log("Error:", error);
        toast.error("Something went wrong during upload.");
        return;
      }

      if (response && response.data !== null) {
        toast.success("File uploaded successfully!");
      } else {
        toast.error("Unable to update the record.");
      }
    }
  };

  const handleNo = () => {
    setShowMessage(false);
  };

  useEffect(() => {
    getProxiApi(setLoading,setproxies , token , page, pageSize , setCount);
  }, [page, pageSize]);

  const columns = [
    {
      field: "proxyId",
      headerName: "ProxyID",
      width: 70,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "proxy",
      headerName: "Proxy",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    { field: "port", headerName: "Port", width: 120, align: "center", headerAlign: "center", },
    {
      field: "userName",
      headerName: "UserName",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "password",
      headerName: "Password",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "failedCount",
      headerName: "FailedCount",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "cluster",
      headerName: "Cluster",
      width: 100,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "proxyTag",
      headerName: "ProxyTag",
      width: 120,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "createdBy",
      headerName: "CreatedBy",
      width: 120,
      headerAlign: "center",
      align: "center",
      valueGetter: (params) => {
        return params.row.createdBy
          ? formatDateWithTime(params.row.createdBy)
          : "N/A";
      },
    },
    {
      field: "createdAt",
      headerName: "CreatedAt",
      width: 200,
      headerAlign: "center",
      align: "center",
      valueGetter: (params) => {
        return params.row.createdAt
          ? formatDateWithTime(params.row.createdAt)
          : "N/A";
      },
    },
    {
      field: "updatedAt",
      headerName: "UpdatedAt",
      width: 120,
      headerAlign: "center",
      align: "center",
      valueGetter: (params) => {
        return params.row.updatedAt ? formatDate(params.row.updatedAt) : "N/A";
      },
    },
    {
      field: "updatedBy",
      headerName: "UpdatedBy",
      width: 150,
      headerAlign: "center",
      align: "center",
      valueGetter: (params) => {
        return params.row.updatedBy ? params.row.updatedBy : "N/A";
      },
    },
    {
      field: "isActive",
      headerName: "Active",
      width: 120,
      headerAlign: "center",
      align: "center",
      valueGetter: (params) => {
        return params.row.isActive !== null ? params.row.isActive : "N/A";
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
  return (
    <div className="border-collapse m-5 border-gray-600">
      {loading && <Loader />}
      <div className="flex items-center relative z-10 mr-3 ml-3 justify-between rounded-xl h-20 bg-[#2F2F2F] p-4"
        style={{ backgroundColor: colors.background }}
      >
        <div className="flex items-center space-x-3">
          <Image
            src={proxiIcon}
            alt="logo"
            className="w-7 h-7"
            style={{ filter: "invert(100%)" }}
          />
          <h1
            className="text-3xl font-medium"
            style={{ color: theme === "light" ? "#fff" : "#fff" }}
          >
            Proxies
          </h1>
        </div>

        <StylishButton onClick={() => fileInputRef.current.click()}>
          <RiFolderUploadFill
            style={{
              fontSize: "1.5rem",
              fontWeight: "bolder",
              marginRight: "2px",
            }}
          />
          Bulk Upload
        </StylishButton>

        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }} // Hide the file input
          onChange={handleFileChange} // Set file on change
        />
      </div>
      <div className="relative -mt-10 z-0">
        <MuiGridNew rows={proxies}
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