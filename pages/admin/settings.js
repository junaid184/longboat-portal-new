import React, { useState, useEffect } from "react";
import { fetchApi } from "../../fetchApi";
import { toast } from "react-toastify";
import { MdEdit } from "react-icons/md";
import { Skeleton } from "@mui/material";
import Image from "next/image";
import settingIcon from "../../assets/images/setting.png";
import {
  Modal,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
} from "@mui/material";
import StylishButton from "../../components/StylishButton";
import { useTheme } from "../../context/themeContext";

export async function getServerSideProps(context) {
  const { req } = context;
  const token = req.cookies.ajs_anonymous_id;

  return {
    props: { token },
  };
}

const initialSettingsData = {
  settingId: 1,
  skyboxXAccount: "",
  skyboxXApplicationToken: "",
  skyboxXApiToken: "",
  tag: "",
  skyboxVendorID: "",
  internalNotes: "",
  publicNotes: "",
  stockType: "",
  automatiqXApiToken: "",
  automatiqXCompanyId: "",
  failedProxiesThreshold: "",
  mails: "",
  gmailUser: "",
  gmailPassword: "",
  fromMail: "",
};

export default function Settings({ token }) {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState(initialSettingsData);
  const [isEditMode, setIsEditMode] = useState(false);
  const [open, setOpen] = useState(false);

  // Use theme from context
  const { theme, toggleTheme } = useTheme();

  // Open modal
  const handleOpen = () => {
    setIsEditMode(true);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setIsEditMode(false);
    setFormValues(initialSettingsData); // Reset form
  };

  const handleInputChange = (field, value) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [field]: value,
    }));
  };

  const getSettingApi = async () => {
    setLoading(true);
    const [responseData, error] = await fetchApi({
      method: "GET",
      endPoint: "settings",
      params: { page: 1, limit: 1000 },
      token,
    });

    if (error) {
      toast.error(
        error.response ? error.response.data?.message : error.message
      );
      setLoading(false);
      return;
    }

    if (responseData && responseData.isSuccess && responseData.data) {
      const setting = responseData.data; // Extract the `data` object
      setSettings([setting]); // Store it as an array if required elsewhere
      setFormValues(setting); // Set form values with the setting object
    } else {
      toast.error("Unexpected response format from the API.");
    }

    setLoading(false);
  };

  useEffect(() => {
    getSettingApi();
  }, []);

  const handleSubmit = async () => {
    const [data, error] = await fetchApi({
      method: "PUT",
      endPoint: `settings`,
      data: { ...formValues, settingId: 1 },
      token,
    });

    if (error) {
      toast.error(
        error.response ? error?.response?.data?.message : error.message
      );
      return;
    }

    toast.success("Settings updated successfully!");
    setIsEditMode(false);
    handleClose();
    getSettingApi();
  };

  const themeStyles = {
    backgroundColor: theme === "light" ? "#ffffff" : "#2F2F2F",
    color: theme === "light" ? "#000000" : "#ffffff",
  };

  return (
    <div className="border-collapse m-2 border-gray-600" style={themeStyles}>
      <div className="flex flex-col rounded-lg">
        <div className="flex items-center justify-between h-20 relative z-10 p-4">
          <div
            className="flex items-center w-full h-20 rounded-lg p-2"
            style={{
              backgroundColor: theme === "light" ? "#2F2F2F" : "#686868",
            }}
          >
            <Image
              src={settingIcon}
              alt="logo"
              className="w-8 h-8"
              style={{
                filter:
                  "invert(100%) sepia(100%) saturate(0%) hue-rotate(200deg)",
              }}
            />
            <h1 className="text-3xl font-medium ml-4" style={{ color: "#fff" }}>
              Settings
            </h1>
          </div>
        </div>

        <div className="w-full mt-3">
          <Paper elevation={1} className="px-8 py-8 w-full relative -mt-10 z-0">
            <Typography className="mb-5 border-b-2 border-gray-800 pb-2"></Typography>

            {loading ? (
              // Single Skeleton Rectangle
              <Skeleton variant="rectangular" width="100%" height={400} animation="wave"
                sx={{ backgroundColor: theme === 'dark' ? '#D3D3D3' : '#e0e0e0' }} />
            ) : (
              <Box component="form" className="flex flex-col space-y-4">
                {/* Row 1 */}
                <Box className="flex space-x-4">
                  <TextField
                    label="Skybox X-Account"
                    type="text"
                    variant="outlined"
                    fullWidth
                    required
                    value={formValues.skyboxXAccount}
                    onChange={(e) =>
                      handleInputChange("skyboxXAccount", e.target.value)
                    }
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    label="Skybox X-Application Token"
                    type="text"
                    variant="outlined"
                    fullWidth
                    required
                    value={formValues.skyboxXApplicationToken}
                    onChange={(e) =>
                      handleInputChange("skyboxXApplicationToken", e.target.value)
                    }
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    label="Skybox X-Api Token"
                    type="text"
                    variant="outlined"
                    fullWidth
                    required
                    value={formValues.skyboxXApiToken}
                    onChange={(e) =>
                      handleInputChange("skyboxXApiToken", e.target.value)
                    }
                    InputLabelProps={{ shrink: true }}
                  />
                </Box>

                {/* Row 2 */}
                <Box className="flex space-x-4">
                  <TextField
                    label="Tag"
                    type="text"
                    variant="outlined"
                    fullWidth
                    required
                    value={formValues.tag}
                    onChange={(e) => handleInputChange("tag", e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    label="Skybox Vendor ID"
                    type="text"
                    variant="outlined"
                    fullWidth
                    required
                    value={formValues.skyboxVendorID}
                    onChange={(e) =>
                      handleInputChange("skyboxVendorID", e.target.value)
                    }
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    label="Internal Notes"
                    type="text"
                    variant="outlined"
                    fullWidth
                    required
                    value={formValues.internalNotes}
                    onChange={(e) =>
                      handleInputChange("internalNotes", e.target.value)
                    }
                    InputLabelProps={{ shrink: true }}
                  />
                </Box>

                {/* Row 3 */}
                <Box className="flex space-x-4">
                  <TextField
                    label="Public Notes"
                    type="text"
                    variant="outlined"
                    fullWidth
                    required
                    value={formValues.publicNotes}
                    onChange={(e) =>
                      handleInputChange("publicNotes", e.target.value)
                    }
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    label="Stock Type"
                    type="text"
                    variant="outlined"
                    fullWidth
                    required
                    value={formValues.stockType}
                    onChange={(e) =>
                      handleInputChange("stockType", e.target.value)
                    }
                    InputLabelProps={{ shrink: true }}
                  />
                </Box>

                {/* Row 4 */}
                <Box className="flex space-x-4">
                  <TextField
                    label="automatiq X-Api Token"
                    type="text"
                    variant="outlined"
                    fullWidth
                    required
                    value={formValues.automatiqXApiToken}
                    onChange={(e) =>
                      handleInputChange("automatiqXApiToken", e.target.value)
                    }
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    label="automatiq X-Company ID"
                    type="text"
                    variant="outlined"
                    fullWidth
                    required
                    value={formValues.automatiqXCompanyId}
                    onChange={(e) =>
                      handleInputChange("automatiqXCompanyId", e.target.value)
                    }
                    InputLabelProps={{ shrink: true }}
                  />
                </Box>

                {/* Row 5 */}
                <Box className="flex space-x-4">
                  <TextField
                    label="Failed Proxies Threshold"
                    type="number"
                    variant="outlined"
                    fullWidth
                    required
                    value={formValues.failedProxiesThreshold}
                    onChange={(e) =>
                      handleInputChange("failedProxiesThreshold", e.target.value)
                    }
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    label="Mails"
                    type="text"
                    variant="outlined"
                    fullWidth
                    required
                    value={formValues.mails}
                    onChange={(e) => handleInputChange("mails", e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    label="Gmail User"
                    type="text"
                    variant="outlined"
                    fullWidth
                    required
                    value={formValues.gmailUser}
                    onChange={(e) =>
                      handleInputChange("gmailUser", e.target.value)
                    }
                    InputLabelProps={{ shrink: true }}
                  />
                </Box>

                {/* Row 6 */}
                <Box className="flex space-x-4">
                  <TextField
                    label="Gmail Password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    required
                    value={formValues.gmailPassword}
                    onChange={(e) =>
                      handleInputChange("gmailPassword", e.target.value)
                    }
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    label="From Mail"
                    type="email"
                    variant="outlined"
                    fullWidth
                    required
                    value={formValues.fromMail}
                    onChange={(e) =>
                      handleInputChange("fromMail", e.target.value)
                    }
                    InputLabelProps={{ shrink: true }}
                  />
                </Box>

                {/* Update Button */}
                <Box className="flex space-x-4">
                  <Button
                    disabled={loading}
                    onClick={handleSubmit}
                    sx={{
                      backgroundColor: "#374151",
                      width: "100%",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "#2F2F2F",
                      },
                    }}
                  >
                    Update Settings
                  </Button>
                </Box>
              </Box>
            )}
          </Paper>
        </div>
      </div>
    </div>
  );
}
