import React from "react";
import { Modal, Box, Button, TextField, Typography } from "@mui/material";
import { Formik, Field, ErrorMessage } from "formik";
import { userValidationSchema } from "../utils/validation";

const UserModal = ({
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
            userEmail: selectedRow?.userEmail || "",
            userName: selectedRow?.userName || "",
            password: selectedRow?.password || "",
            role: selectedRow?.role || "",
          }}
          validationSchema={userValidationSchema}
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
                {isEditMode ? "Update " : "Add "} User
              </Typography>

              <Field
                name="userName"
                as={TextField}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.userName}
                label="userName"
                variant="outlined"
                fullWidth
                margin="normal"
                helperText={<ErrorMessage name="userName" />}
                error={!!(touched.userName && errors.userName)}
              />

              <Field
                name="userEmail"
                as={TextField}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.userEmail}
                label="Email"
                variant="outlined"
                fullWidth
                margin="normal"
                helperText={<ErrorMessage name="email" />}
                error={!!(touched.userEmail && errors.userEmail)}
              />

              
                <Field
                  name="password"
                  as={TextField}
                  label="Password"
                  type="password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.password}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  helperText={<ErrorMessage name="password" />}
                  error={!!(touched.password && errors.password)}
                />
              
              <Field
                name="role"
                as={TextField}
                type="number"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.role}
                label="Role"
                variant="outlined"
                fullWidth
                margin="normal"
                helperText={<ErrorMessage name="role" />}
                error={!!(touched.role && errors.role)}
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
                {isEditMode ? "Update User" : "Add User"}
              </Button>
            </form>
          )}
        </Formik>
      </Box>
    </Modal>
  );
};

export default UserModal;
