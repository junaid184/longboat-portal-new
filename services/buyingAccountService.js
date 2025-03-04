// userService.js
import { fetchApi } from "../fetchApi";
import { toast } from "react-toastify";

export const getAccounts = async (setLoading, setRows, token, page = 1, pageSize = 0, setCount) => {
  setLoading(true);

  const [response, error] = await fetchApi({
    method: "POST",
    endPoint: "BuyingAccount/filter",
    data: { page: page + 1, pageSize },
    token,
  });

  setLoading(false);

  if (error) {
    toast.error(error.response ? error.response.data.message : error.message);
    return null; // Explicitly return null on error
  }

  if (response?.data?.count !== undefined) {
    // Update count
    setCount(response?.data?.count || 0);

    // Map user data and ensure each item has a unique ID
    const accountsWithIds = response.data?.data?.map((account) => ({
      ...account,
      id: account.accountId, // Assuming userId is the unique field
    }));

    setRows(accountsWithIds); // Set rows
    return accountsWithIds; // Explicitly return the users data
  } else {
    toast.error("Unexpected response format from the API.");
    return null; // Explicitly return null on unexpected response
  }
};
export const accountSubmit = async (
  values,
  { setSubmitting },
  isEditMode,
  selectedRow,
  token,
  getAccounts,
  handleClose
) => {
  setSubmitting(true); // Show loading state during submission

  try {
    let response;
    if (isEditMode) {
      response = await fetchApi({
        method: "PUT",
        endPoint: `BuyingAccount`,
        data: { ...values },
        token,
      });
      toast.success("Account updated successfully.");
    } else {
      response = await fetchApi({
        method: "POST",
        endPoint: "BuyingAccount",
        data: { ...values },
        token,
      });
      toast.success("Account added successfully.");
    }
    getAccounts();
    handleClose(); // Close modal after success
  } catch (error) {
    toast.error(error.response ? error.response.data.message : error.message);
  } finally {
    setSubmitting(false); // Stop loading state
  }
};

export const deleteAccount = async (accountId, events, setEvents, token) => {
  const [data, error] = await fetchApi({
    method: "DELETE",
    endPoint: `BuyingAccount/?id=${accountId}`,
    token,
  });

  if (error) {
    toast.error(error.response ? error.response.data.message : error.message);
    return;
  }

  toast.success("Account deleted successfully.");
};

