import React from "react";
import { Formik, ErrorMessage } from "formik";
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  Modal,
  CircularProgress,
} from "@mui/material";

const TicketModal = ({
  open,
  onClose,
  selectedRow,
  initialValues,
  isEditMode,
  onSubmit,
}) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        className="flex absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white w-6/12 h-auto p-6 rounded-lg shadow-lg"
      >
        <Formik
          initialValues={selectedRow || initialValues}
          onSubmit={onSubmit}
        >
          {({
            isSubmitting,
            touched,
            errors,
            handleSubmit,
            handleChange,
            handleBlur,
            values,
            setFieldValue,
          }) => (
            <form onSubmit={handleSubmit} className="w-full">
              <Typography
                className="mb-5 text-gray-700 font-bold text-3xl border-b-2 border-gray-800 pb-2"
              >
                {isEditMode ? "Update" : "Add"} Event Details
              </Typography>

              <Box className="flex flex-col space-y-4">
                {/* Bulk Type Selection */}
                <TextField
                  select
                  name="type"
                  label="Bulk Type"
                  value={values.type}
                  onChange={(e) => setFieldValue("type", e.target.value)}
                  fullWidth
                  variant="outlined"
                  error={touched.type && Boolean(errors.type)}
                  helperText={<ErrorMessage name="type" />}
                >
                  <MenuItem value="">Select Type</MenuItem>
                  <MenuItem value="1">By Artist</MenuItem>
                  <MenuItem value="2">By Venue</MenuItem>
                  <MenuItem value="3">By Keyword</MenuItem>
                </TextField>

                {/* Keyword Input */}
                <TextField
                  name="keyword"
                  label="Keyword"
                  value={values.keyword}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  error={touched.keyword && Boolean(errors.keyword)}
                  helperText={<ErrorMessage name="keyword" />}
                />

                {/* Start Date */}
                <TextField
                  name="startDate"
                  label="Start Date"
                  type="date"
                  value={values.startDate}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  error={touched.startDate && Boolean(errors.startDate)}
                  helperText={<ErrorMessage name="startDate" />}
                  InputLabelProps={{ shrink: true }}
                />

                {/* End Date */}
                <TextField
                  name="endDate"
                  label="End Date"
                  type="date"
                  value={values.endDate}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  error={touched.endDate && Boolean(errors.endDate)}
                  helperText={<ErrorMessage name="endDate" />}
                  InputLabelProps={{ shrink: true }}
                />

                {/* Submit Button */}
                <Button
                  type="submit"
                  fullWidth
                  disabled={isSubmitting}
                  variant="contained"
                  sx={{
                    backgroundColor: "#374151",
                    color: "white",
                    "&:hover": {
                      backgroundColor: isSubmitting ? "#374151" : "#2F2F2F",
                    },
                  }}
                >
                  {isSubmitting ? (
                    <CircularProgress size={18} sx={{ color: "white" }} />
                  ) : isEditMode ? (
                    "Update"
                  ) : (
                    "Search Events"
                  )}
                </Button>
              </Box>
            </form>
          )}
        </Formik>
      </Box>
    </Modal>
  );
};

export default TicketModal;
