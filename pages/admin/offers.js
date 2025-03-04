import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import Image from "next/image";
import MuiGrid from "../../components/MuiGrid";
import { Edit, Delete } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { MdAdd } from "react-icons/md";
import offerIcon from "../../assets/images/offer.png";
import axios from "axios";
import MessageAlert from "../../components/messageAlert";
import OfferModal from "../../components/OfferModal";
import StylishButton from "../../components/StylishButton";
import { useTheme } from "../../context/themeContext";
import { updateOffer, handleDelete } from "../../services/offerServices";

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
  const [selectedUserId, setSelectedUserId] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const { theme } = useTheme();
  const [totalCount, setTotalCount] = useState(0);

  const fetchData = async (token, currentPage, currentPageSize) => {
    setLoading(true); // Start loading state
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BaseURL}/api/offers/filter`,
        { page: currentPage + 1, pageSize: currentPageSize },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Ensure data structure is correct
      if (response.data?.data) {
        const updatedRows = response.data.data.map((row) => ({
          ...row,
          id: row.offerId,
        }));
        setRows(updatedRows);
        setTotalCount(response.data?.totalCount || 100); // Adjust total count if needed
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
    console.log("New page size:", newPageSize);

    setLoading(true); // Trigger loading state for page size change
    setPageSize(newPageSize);
    fetchData(token, page, newPageSize); // Use the new page size directly
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    console.log("New page:", newPage);

    setLoading(true); // Trigger loading state for page change
    setPage(newPage);
    fetchData(token, newPage, pageSize); // Use the new page directly
  };
  const handleUpdateOffer = async (values) => {
    const success = await updateOffer(
      values,
      isEditMode,
      selectedUserId,
      token
    );
    console.log("Success:", success);

    if (success) {
      handleClose();

      // If you want to refetch all rows:
      fetchData(token, page, pageSize);
      if (isEditMode) {
        setRows((prevRows) =>
          prevRows.map((row) =>
            row.offerId === success.data.offerId
              ? { ...success.data, id: success.data.offerId } // Add `id` property
              : row
          )
        );
      } else {
        setRows((prevRows) => [
          { ...success.data, id: success.data.offerId }, // Add `id` property
          ...prevRows,
        ]);
      }

      // Alternatively, update rows directly if `updateOffer` returns the updated offer data:
      // const updatedRow = success.data; // Assuming `success.data` contains the updated row
      // setRows((prevRows) =>
      //   isEditMode
      //     ? prevRows.map((row) => (row.offerId === updatedRow.offerId ? updatedRow : row))
      //     : [updatedRow, ...prevRows] // Add new offer to the top
      // );
    }
  };

  const handleDeleteConfirm = async () => {
    if (selectedRow) {
      const success = await handleDelete(selectedRow.offerId, token);
      if (success) {
        const updatedRows = rows.filter(
          (user) => user.offerId !== selectedRow.offerId
        );
        setRows(updatedRows);
      }
      setShowDeleteConfirmation(false);
    }
  };
  const showItemsClickHandler = (data) => {
    console.log("showItemsClickHandler", data);

    setSelectedUserId(data?.offerId || null);
    setIsEditMode(!!data);
    setSelectedRow(data);
    handleOpen();
  };
  const handleSelectionModelChange = (newSelection) => {
    console.log("Selected Row IDs:", newSelection); // Log selected row ids (based on `id` field)

    // Map selected row ids to user ids
    const selectedIds = newSelection.map(
      (id) => rows.find((row) => row.id === id)?.offerId
    );
    setSelectedUserIds(selectedIds);

    console.log("Selected User IDs:", selectedIds); // Log selected userIds
  };
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setSelectedRow(null);
    setIsEditMode(false);
  };

  const columns = [
    {
      field: "offerId",
      headerName: "# ID",
      width: 70,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <div className="flex items-center justify-center w-80 space-x-4">
          <span>{params.row.offerId}</span>
        </div>
      ),
    },
    {
      field: "offerName",
      headerName: "Offers Name",
      width: 300,
      headerAlign: "center",
      renderCell: (params) => (
        <div
          className="flex items-center  w-80 space-x-4 overflow-x-auto"
          style={{
            whiteSpace: "nowrap",
            overflowX: "auto",
            textOverflow: "ellipsis",
            height: "56px",
            lineHeight: "1",

            overflowY: "hidden",
          }}
        >
          <span>{params.row.offerName}</span>
        </div>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <>
          <IconButton onClick={() => showItemsClickHandler(params.row)}>
            <Edit />
          </IconButton>
          <IconButton
            onClick={() => {
              setSelectedRow(params.row);
              setShowDeleteConfirmation(true);
            }}
          >
            <Delete />
          </IconButton>
        </>
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
    <div className="border-collapse m-5 border-gray-600">
      {/* Header section */}
      <div
        className="relative z-10 flex items-center justify-between rounded-xl h-20 bg-[#2F2F2F] p-4 mr-4 ml-4"
        style={{ backgroundColor: colors.background }}
      >
        <div className="flex items-center">
          <Image
            src={offerIcon}
            alt="logo"
            className="w-8 h-8"
            style={{
              filter:
                "invert(100%) sepia(100%) saturate(0%) hue-rotate(200deg)",
            }}
          />
          <h1 className="text-3xl font-medium text-white ml-4">Offers</h1>
        </div>
        <StylishButton onClick={() => showItemsClickHandler(null)}>
          <MdAdd
            style={{
              fontSize: "1.5rem",
              fontWeight: "bolder",
              marginRight: "2px",
            }}
          />{" "}
          Add Offer
        </StylishButton>
      </div>
      {showDeleteConfirmation && (
        <MessageAlert
          type="danger"
          message="Are you sure you want to delete this user?"
          onClickYes={handleDeleteConfirm}
          onClickNo={() => setShowDeleteConfirmation(false)}
        />
      )}
      {/* DataGrid directly without loading condition */}
      <div className="relative -mt-10 z-0">
        <MuiGrid
               data={rows || []}
               columns={columns}
               loading={loading}
               checkboxSelection // Enable checkbox selection for multiple row selection
               onSelectionModelChange={(newSelection) => handleSelectionModelChange(newSelection)} // Handle row selection
             />
      </div>
      <OfferModal
        open={open}
        handleClose={handleClose}
        handleUpdateUser={handleUpdateOffer}
        isEditMode={isEditMode}
        selectedRow={selectedRow}
      />
    </div>
  );
};

export default DataGridWithPagination;
