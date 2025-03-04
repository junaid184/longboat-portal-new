import React, { useState, useEffect } from "react";
import { IconButton } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import MuiGrid from "../../components/MuiGrid";
import MessageAlert from "../../components/messageAlert";
import { MdAdd } from "react-icons/md";
import userIcon from "../../assets/images/users.png";
import Image from "next/image";
import { getUsersApi, updateUser, handleDelete } from "../../services/userService";
import UserModal from "../../components/UserModal";
import StylishButton from "../../components/StylishButton";
import { useTheme } from "../../context/themeContext";
import { Skeleton } from "@mui/material";

export async function getServerSideProps(context) {
  const { req } = context;
  const token = req.cookies.ajs_anonymous_id;
  return { props: { token } };
}

export default function Users({ token }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [open, setOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const { theme } = useTheme();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [count, setCount] = useState(0);

  const fetchUsers = async () => {
    setLoading(true);
    const users = await getUsersApi(setLoading, setRows, token, page, pageSize, setCount);

    if (users) setRows(users);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, [token, page, pageSize]);

  const handlePageSizeChange = (newPageSize) => setPageSize(newPageSize);
  const handlePageChange = (newPage) => setPage(newPage);

  const handleSelectionModelChange = (newSelection) => {
    console.log("Selected Row IDs:", newSelection); // Log selected row ids (based on `id` field)

    // Map selected row ids to user ids
    const selectedIds = newSelection.map((id) => rows.find((row) => row.id === id)?.userId);
    setSelectedUserIds(selectedIds);

    console.log("Selected User IDs:", selectedIds); // Log selected userIds
  };

  const showItemsClickHandler = (data) => {
    setSelectedUserId(data?.userId || null);
    setIsEditMode(!!data);
    setSelectedRow(data);
    handleOpen();
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleUpdateUser = async (values) => {
    const success = await updateUser(values, isEditMode, selectedUserId, token);
    if (success) {
      handleClose();
      fetchUsers();
    }
  };

  const handleDeleteConfirm = async () => {
    if (selectedRow) {
      const success = await handleDelete(selectedRow.userId, token);
      if (success) {
        const updatedRows = rows.filter((user) => user.userId !== selectedRow.userId);
        setRows(updatedRows);
      }
      setShowDeleteConfirmation(false);
    }
  };

  const columns = [
    { field: "userName", headerName: "Employee Name", width: 200 },
    { field: "userEmail", headerName: "Email", width: 220 },
    { field: "roleName", headerName: "Role", width: 120 },
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
    <div className="m-5">
      <div className="flex items-center relative z-10 mr-4 ml-4 justify-between rounded-xl h-20 bg-[#2F2F2F] p-4"
        style={{ backgroundColor: colors.background }}
      >
        <div className="flex items-center space-x-3">
          <Image
            src={userIcon}
            alt="logo"
            className="w-7 h-7"
            style={{ filter: "invert(100%)" }}
          />
          <h1
            className="text-3xl font-medium"
            style={{ color: theme === "light" ? "#fff" : "#fff" }}
          >
            Users
          </h1>
        </div>
        <StylishButton onClick={() => showItemsClickHandler(null)}>
          <MdAdd style={{ fontSize: "1.5rem", fontWeight: "bolder", marginRight: "2px" }} /> Add User
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
      <div className="relative -mt-10 z-0">
        {loading ? (
          // <div className="border border-gray-300 rounded-lg p-2">
          <Skeleton
            variant="rectangular"
            width="100%"
            height={550} // Adjust height as needed
            sx={{ backgroundColor: theme === 'dark' ? '#D3D3D3' : '#e0e0e0' }}
          />
          // </div>
        ) : (
          <MuiGrid
            data={rows || []}
            columns={columns}
            loading={loading}
            checkboxSelection // Enable checkbox selection for multiple row selection
            onSelectionModelChange={(newSelection) => handleSelectionModelChange(newSelection)} // Handle row selection
          />
        )}
      </div>
      {/* Modal for Add/Edit */}
      <UserModal
        open={open}
        handleClose={handleClose}
        handleUpdateUser={handleUpdateUser}
        isEditMode={isEditMode}
        selectedRow={selectedRow}
      />
    </div>
  );
}
