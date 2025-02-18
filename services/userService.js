// userService.js
import { fetchApi } from "../fetchApi";
import { toast } from "react-toastify";

export const getUsersApi = async (setLoading, setRows, token, page = 1, pageSize = 0, setCount) => {
  setLoading(true);

  const [response, error] = await fetchApi({
    method: "POST",
    endPoint: "user/filter",
    data: { userName: "", userEmail: "", password: "", role: 3, page, pageSize },
    token,
  });

  setLoading(false);

  if (error) {
    toast.error(error.response ? error.response.data.message : error.message);
    return null; // Explicitly return null on error
  }

  if (response?.data) {
    // Update count
    setCount(response?.count || 50);

    // Map user data and ensure each item has a unique ID
    const usersWithIds = response.data.map((user) => ({
      ...user,
      id: user.userId, // Assuming userId is the unique field
    }));

    setRows(usersWithIds); // Set rows
    return usersWithIds; // Explicitly return the users data
  } else {
    toast.error("Unexpected response format from the API.");
    return null; // Explicitly return null on unexpected response
  }
};


export const updateUser = async (values, isEditMode, selectedUserId, token) => {
  const { userName, userEmail, password , role } = values;

  if (isEditMode) {
    const [data, error] = await fetchApi({
      method: "PUT",
      endPoint: "User",
      data: { userId: selectedUserId, userName, userEmail , password, role},
      token,
    });

    if (error) {
      toast.error(
        error.response ? error?.response?.data?.message : error.message
      );
      return false;
    }

    toast.success("User updated successfully.");
    return true;
  } else {
    const [data, error] = await fetchApi({
      method: "POST",
      endPoint: "User/Register",
      data: { userName, userEmail, password , role },
      token,
    });

    if (error) {
      console.log(error,"error");
      
      if (error.response?.data) {
        toast.error(error.response?.data?.Errors);
      } else {
        toast.error(
          error.response ? error?.response?.data?.message : error.message
        );
      }
      return false;
    }

    toast.success("User added successfully.");
    return true;
  }
};

export const handleDelete = async (userId, token) => {
  const [data, error] = await fetchApi({
    method: "DELETE",
    endPoint: `User/?id=${userId}`,
    token,
  });

  if (error) {
    toast.error(
      error.response ? error?.response?.data?.message : error.message
    );
    return false;
  }

  toast.success("User deleted successfully.");
  return true;
};
