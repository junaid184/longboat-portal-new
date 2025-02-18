// userService.js
import { fetchApi } from "../fetchApi";
import { toast } from "react-toastify";


export const updateOffer = async (values, isEditMode, selectedUserId, token) => {
  const { offerName} = values;
console.log(selectedUserId,"selectedUserId");

  if (isEditMode) {
    const [data, error] = await fetchApi({
      method: "PUT",
      endPoint: "offers",
      data: { offerId: selectedUserId, offerName},
      token,
    });

    if (error) {
      toast.error(
        error.response ? error?.response?.data?.message : error.message
      );
      return false;
    }

    toast.success("Offer updated successfully.");
    return data;
  } else {
    const [data, error] = await fetchApi({
      method: "POST",
      endPoint: "offers",
      data: { offerName },
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

    toast.success("Offer added successfully.");
    return data;
  }
};

export const handleDelete = async (offerId, token) => {
  const [data, error] = await fetchApi({
    method: "DELETE",
    endPoint: `offers?id=${offerId}`,
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
