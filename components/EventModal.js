import React from "react";
import {CircularProgress} from "@mui/material"; 
import { Formik, Field, ErrorMessage } from "formik";
import {
  Box,
  Button,
  TextField,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Modal,
} from "@mui/material";

const EventModal = ({
  open,
  onClose,
  selectedRow,
  initialValues,
  validationSchema,
  isEditMode,
  onSubmit,
  eventTypes,
}) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box className="flex absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white w-6/12 h-[500px] p-6 rounded-lg shadow-lg">
        <Formik
          // enableReinitialize
          initialValues={selectedRow || initialValues}
          validationSchema={validationSchema}
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
          }) => (
            <form onSubmit={handleSubmit} className="w-full">
              <Typography className="mb-5 text-gray-700 font-bold text-3xl border-b-2 border-gray-800 pb-2">
                {isEditMode ? "Update " : "Add "} Event Details
              </Typography>

              <Box className="flex flex-col space-y-4">
                {/* Row 1 */}
                <Box className="flex space-x-4">
                  <TextField
                    name="image"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.image}
                    label="ImageURL"
                    type="text"
                    variant="outlined"
                    fullWidth
                    required
                    helperText={<ErrorMessage name="image" />}
                    error={touched.image && Boolean(errors.image)}
                  />
                  <TextField
                    name="eventName"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.eventName}
                    label="Event Name"
                    type="text"
                    required
                    variant="outlined"
                    fullWidth
                    helperText={<ErrorMessage name="eventName" />}
                    error={touched.eventName && Boolean(errors.eventName)}
                  />
                  <TextField
                    name="venueName"
                    label="Venue Name"
                    type="text"
                    variant="outlined"
                    fullWidth
                    required
                    value={values.venueName}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    helperText={<ErrorMessage name="venueName" />}
                    error={touched.venueName && Boolean(errors.venueName)}
                  />
                </Box>

                {/* Row 2 */}
                <Box className="flex space-x-4">
                  <TextField
                    name="tmEventId"
                    label="TM Event ID"
                    type="text"
                    variant="outlined"
                    fullWidth
                    required
                    value={values.tmEventId}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    helperText={<ErrorMessage name="axsEventId" />}
                    error={touched.tmEventId && Boolean(errors.tmEventId)}
                  />
                  <TextField
                    name="eventMappingId"
                    label="Event Mapping ID"
                    type="text"
                    variant="outlined"
                    fullWidth
                    required
                    value={values.eventMappingId}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    helperText={<ErrorMessage name="eventMappingId" />}
                    error={
                      touched.eventMappingId && Boolean(errors.eventMappingId)
                    }
                  />
                  <TextField
                    name="listCostPercentage"
                    label="List Cost Percentage"
                    type="number"
                    variant="outlined"
                    fullWidth
                    required
                    value={values.listCostPercentage}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    helperText={<ErrorMessage name="listCostPercentage" />}
                    error={
                      touched.listCostPercentage &&
                      Boolean(errors.listCostPercentage)
                    }
                  />
                  
                  <TextField
                    name="rank"
                    label="Rank"
                    type="number"
                    variant="outlined"
                    fullWidth
                    required
                    value={values.rank}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    helperText={<ErrorMessage name="rank" />}
                    error={
                      touched.rank &&
                      Boolean(errors.rank)
                    }
                  />
                </Box>

                {/* Row 3 */}
                <Box className="flex space-x-4">
                  <TextField
                    name="inHandDate"
                    label="In Hand Date"
                    type="date"
                    variant="outlined"
                    fullWidth
                    required
                    InputLabelProps={{ shrink: true }}
                    value={values.inHandDate ? values.inHandDate : ""}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    helperText={<ErrorMessage name="inHandDate" />}
                    error={touched.inHandDate && Boolean(errors.inHandDate)}
                  />
                  <TextField
                    name="eventDate"
                    label="Event Date"
                    type="datetime-local"
                    variant="outlined"
                    fullWidth
                    required
                    InputLabelProps={{ shrink: true }}
                    value={values.eventDate ? values.eventDate : ""}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    helperText={<ErrorMessage name="eventDate" />}
                    error={touched.eventDate && Boolean(errors.eventDate)}
                  />
                  <TextField
                    name="shownQuantity"
                    label="Shown Quantity"
                    type="text"
                    variant="outlined"
                    fullWidth
                    required
                    value={values.shownQuantity}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    helperText={<ErrorMessage name="shownQuantity" />}
                    error={
                      touched.shownQuantity &&
                      Boolean(errors.shownQuantity)
                    }
                  />
                </Box>

                {/* Row 5 */}
                <Box className="flex space-x-3">
                  <TextField
                    name="eventUrl"
                    label="Event URL"
                    type="text"
                    variant="outlined"
                    fullWidth
                    required
                    value={values.eventUrl}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    helperText={<ErrorMessage name="eventUrl" />}
                    error={touched.eventUrl && Boolean(errors.eventUrl)}
                  />
                </Box>
                {/* Checkbox Fields */}
                <Box className="flex">
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="allowPreSales"
                        checked={values.allowPreSales || false}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        helperText={<ErrorMessage name="allowPreSales" />}
                        error={touched.allowPreSales && Boolean(errors.allowPreSales)}
                      />
                    }
                    label="allowPreSales"
                    className="w-1/4"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="hasGALAWNPIT"
                        checked={values.hasGALAWNPIT || false}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        helperText={<ErrorMessage name="hasGALAWNPIT" />}
                        error={touched.hasGALAWNPIT && Boolean(errors.hasGALAWNPIT)}
                      />
                    }
                    label="hasGALAWNPIT"
                    className="w-1/4"
                  />
                </Box>
                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  sx={{
                    backgroundColor: "#374151",
                    color: "white",
                    "&:hover": {
                      backgroundColor: isSubmitting ? "#374151" : "#2F2F2F",
                    },
                    cursor: isSubmitting ? "not-allowed" : "pointer",
                  }}
                >
                  {isSubmitting ? (
                    <CircularProgress size={18} sx={{ color: "white" }} />
                  ) : isEditMode ? (
                    "Update"
                  ) : (
                    "Add Event"
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

export default EventModal;
