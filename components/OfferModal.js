import React from "react";
import { Modal, Box, Button, TextField, Typography } from "@mui/material";
import { Formik, Field, ErrorMessage } from "formik";

const OfferModal = ({
  open,
  handleClose,
  handleUpdateUser,
  isEditMode,
  selectedRow,
  isSubmitting,
}) => {
  return (
    <Modal open={open} onClose={handleClose}>
      <Box className="flex absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white w-1/3 rounded-lg shadow-lg p-8">
        <Formik
          initialValues={{
            offerName: selectedRow?.offerName || "",
          }}
          onSubmit={handleUpdateUser} // Called from parent component
        >
          {({
            touched,
            errors,
            handleSubmit,
            handleChange,
            handleBlur,
            values,
          }) => (
            <form onSubmit={handleSubmit} className="w-full">
              <Typography className="mb-5 text-gray-700 font-bold text-3xl border-b-2 border-gray-800 pb-2">
                {isEditMode ? "Update " : "Add "} Offer
              </Typography>

              <Field
                name="offerName"
                as={TextField}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.offerName}
                label="Offer Name"
                variant="outlined"
                fullWidth
                margin="normal"
                helperText={<ErrorMessage name="offerName" />}
                error={!!(touched.offerName && errors.offerName)}
              />

        
              <Button
                type="submit"
                variant="contained"
                sx={{
                  mt: 2,
                  backgroundColor: "#374151", // Black background
                  color: "#fff", // Default text color
                  "&:hover": {
                    backgroundColor: "#000", // Keep the background black on hover
                    color: "#fff", // Change text color to white on hover
                  },
                }}
                fullWidth
                disabled={isSubmitting}
              >
                {isEditMode ? "Update Offer" : "Add Offer"}
              </Button>
            </form>
          )}
        </Formik>
      </Box>
    </Modal>
  );
};

export default OfferModal;
