import React, { useState, useEffect, useRef } from "react";
import MuiGridNew from "../../components/MuiGridNew";
import { formatDateWithTime } from "../../utils";
import Image from "next/image";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";
import { fetchApi } from "../../fetchApi";
import { MdAdd } from "react-icons/md";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import MessageAlert from "../../components/messageAlert";
import { AddAccountSchema } from "../../utils/validation";
import BuyingModal from "../../components/BuyingModal";
import accountIcon from "../../assets/images/users.png";
import { useTheme } from "../../context/themeContext";
import { IconButton, Menu, MenuItem, } from "@mui/material";
import StylishButton from "../../components/StylishButton";
import { getAccounts, accountSubmit, deleteAccount } from "../../services/buyingAccountService";
import { RiFolderUploadFill } from "react-icons/ri";

export async function getServerSideProps(context) {
  const { req } = context;
  const token = req.cookies.ajs_anonymous_id;

  return {
    props: { token },
  };
}

const initialAccountData = {
  email: "",
  tmPassword: "",
  axsPassword: "",
  firstName: "",
  surname: "",
  phoneNo: "",
  street: "",
  city: "",
  state: "",
  zip: null,
  proxy: "",
  takeUsCVC: "",
  takeUsLast4: "",
  amexCVC: "",
  amexLast4: "",
  citiCVC: "",
  citiLast4: ""
};
export default function Event({ token }) {
  const [events, setEvents] = useState([]);
  const [anchorEls, setAnchorEls] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [currentRow, setCurrentRow] = useState(null);
  const fileInputRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedRowIds, setSelectedRowIds] = useState([]);
  const [formValues, setFormValues] = useState(initialAccountData);
  const { theme } = useTheme(); // Access the current theme
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [showMessage, setShowMessage] = useState(false);
  const [count, setCount] = useState(0);


  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    setIsEditMode(false);
    setFormValues(initialAccountData);
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
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    console.log(file, "file");
    setShowMessage(true); // Show confirmation dialog
  };

  const handleActionClick = async (action) => {
    if (currentRow) {
      switch (action) {
        case "edit":
          console.log("Edit clicked");
          UpdateItemsClickHandler("edit", currentRow);
          break;
        case "delete":
          setSelectedRow(currentRow.accountId);
          setShowDeleteConfirmation(true);
          break;
        default:
          break;
      }
      handleMenuClose();
    }
  };

  useEffect(() => {
    getAccounts(setLoading, setEvents, token, page, pageSize, setCount);
    // Pass token as an argument to fetchData
  }, [page, pageSize]);

  const handleEventSubmit = (values, formikHelpers) => {
    accountSubmit(
      values,
      formikHelpers,
      isEditMode,
      selectedRow,
      token,
      () => getAccounts(setLoading, setEvents, token, page, pageSize, setCount),
      handleClose
    );
  };
  const handlePageSizeChange = (newPageSize) => {
    console.log(`page size ${newPageSize}`);
    setPageSize(newPageSize);
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
        endPoint: "BuyingAccount/bulkupload",
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



  // Handle page change
  const handlePageChange = (newPage) => {
    console.log(`page change ${newPage}`);
    setPage(newPage);
  };
  const handleDeleteEvent = async (accountId) => {
    console.log("Event ID to delete:", accountId);
    await deleteAccount(accountId, events, setEvents, token); // Await for deleteEvent to finish
  };

  const showItemsClickHandler = (data) => {
    setSelectedRow(null);
    setSelectedItem(data);
    setIsEditMode(false);
    handleOpen();
  };

  const UpdateItemsClickHandler = (actionType, eventData) => {
    if (actionType === "edit") {

      const updatedEventData = { ...eventData };
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
      field: "email",
      headerName: "Email",
      width: 250,
      headerAlign: "center",
      align: "center",
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
          <span>{params.row.email}</span>
        </div>
      ),
    },
    {
      field: "tmPassword",
      headerName: "Tm Password",
      width: 150,
      headerAlign: "center",
      align: "center",
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
          <span>{params.row.tmPassword}</span>
        </div>
      ),
    },
    {
      field: "axsPassword",
      headerName: "Axs Password",
      width: 120,
      headerAlign: "center",
      align: "center",
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
          <span>{params.row.axsPassword}</span>
        </div>
      ),
    },
    {
      field: "firstName",
      headerName: "First Name",
      width: 180,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => <span>{params.row.firstName}</span>,
    },
    {
      field: "surname",
      headerName: "Surname",
      width: 150,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => <span>{params.row.surname}</span>,
    },
    {
      field: "phoneNo",
      headerName: "Phone #",
      width: 150,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => <span>{params.row.phoneNo}</span>,
    },
    {
      field: "street",
      headerName: "Street",
      width: 220,
      headerAlign: "center",
      align: "center",
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
          <span>{params.row.street}</span>
        </div>
      ),
    },
    {
      field: "city",
      headerName: "City",
      width: 120,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => <span>{params.row.city}</span>,
    },
    {
      field: "state",
      headerName: "State",
      width: 120,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => <span>{params.row.state}</span>,
    },
    {
      field: "zip",
      headerName: "Zip",
      width: 120,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => <span>{params.row.zip}</span>,
    },
    {
      field: "amexCVC",
      headerName: "Amex CVC",
      width: 120,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => <span>{params.row.amexCVC}</span>,
    },
    {
      field: "amexLast4",
      headerName: "Amex Last 4",
      width: 120,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => <span>{params.row.amexLast4}</span>,
    },
    {
      field: "citiCVC",
      headerName: "Citi CVC",
      width: 120,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => <span>{params.row.citiCVC}</span>,
    },
    {
      field: "citiLast4",
      headerName: "Citi Last4",
      width: 120,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => <span>{params.row.citiLast4}</span>,
    },
    {
      field: "takeUsCVC",
      headerName: "Take Us CVC",
      width: 120,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => <span>{params.row.takeUsCVC}</span>,
    },
    {
      field: "takeUsLast4",
      headerName: "Take Us Last4",
      width: 120,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => <span>{params.row.takeUsLast4}</span>,
    },
    {
      field: "proxy",
      headerName: "Proxy",
      width: 220,
      headerAlign: "center",
      align: "center",
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
          <span>{params.row.proxy}</span>
        </div>
      ),
    },
    {
      field: "createdAt",
      headerName: "Created At",
      width: 150,
      headerAlign: "center",
      align: "center",
      valueGetter: (params) => formatDateWithTime(params.row.createdAt), // Access params.row for correct field
    },
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
            </Menu>
          </div>
        );
      },
    },
  ];

  const handleSelectionModelChange = (ids) => {
    setSelectedRowIds(ids);
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
      <div className="border-collapse m-5  ">
        {loading && <Loader />}
        <div
          className="flex items-center relative z-10 justify-between rounded-xl h-20 ml-4 mr-4 px-4"
          style={{ backgroundColor: colors.background }}
        >
          <div className="flex items-center space-x-3">
            <Image
              src={accountIcon}
              alt="logo"
              className="w-7 h-7"
              style={{ filter: "invert(100%)" }}
            />
            <h1
              className="text-3xl font-medium"
              style={{ color: theme === "light" ? "#fff" : "#fff" }}
            >
              Accounts
            </h1>
          </div>

          {/* Button Container */}
          <div className="flex space-x-3">
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

            <StylishButton onClick={() => showItemsClickHandler([])}>
              <MdAdd
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "bolder",
                  marginRight: "2px",
                }}
              />
              Add New Account
            </StylishButton>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }} // Hide the file input
            onChange={handleFileChange} // Set file on change
          />
        </div>

        <BuyingModal
          open={open}
          onClose={handleClose}
          initialValues={selectedRow || initialAccountData}
          validationSchema={AddAccountSchema}
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
        {showMessage && (
          <MessageAlert
            type="normal"
            onClickYes={handleYes}
            onClickNo={handleNo}
          />
        )}
      </div>
    </>
  );
}