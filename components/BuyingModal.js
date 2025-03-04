import React from "react";
import {CircularProgress} from "@mui/material"; 
import { Formik, Field, ErrorMessage } from "formik";
import {
  Box,
  Button,
  TextField,
  Typography,
  Modal,
} from "@mui/material";

const BuyingModal = ({
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
      <Box className="flex absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white w-6/12 h-[400px] p-6 rounded-lg shadow-lg">
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
                {isEditMode ? "Update " : "Add "} Account
              </Typography>

              <Box className="flex flex-col space-y-4">
                {/* Row 1 */}
                <Box className="flex space-x-4">
                  <TextField
                    name="email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.email}
                    label="Email"
                    type="email"
                    variant="outlined"
                    fullWidth
                    required
                    helperText={<ErrorMessage name="email" />}
                    error={touched.email && Boolean(errors.email)}
                  />
                  <TextField
                    name="tmPassword"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.tmPassword}
                    label="Tm Password"
                    type="password"
                    required
                    variant="outlined"
                    fullWidth
                    helperText={<ErrorMessage name="tmPassword" />}
                    error={touched.tmPassword && Boolean(errors.tmPassword)}
                  />
                  <TextField
                    name="axsPassword"
                    label="Axs Password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    required
                    value={values.axsPassword}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    helperText={<ErrorMessage name="axsPassword" />}
                    error={touched.axsPassword && Boolean(errors.axsPassword)}
                 
                 />
                  <TextField
                    name="firstName"
                    label="First Name"
                    type="text"
                    variant="outlined"
                    fullWidth
                    required
                    value={values.firstName}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    helperText={<ErrorMessage name="firstName" />}
                    error={touched.firstName && Boolean(errors.firstName)}
                  />
                  <TextField
                    name="surname"
                    label="Surname"
                    type="text"
                    variant="outlined"
                    fullWidth
                    required
                    value={values.surname}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    helperText={<ErrorMessage name="surname" />}
                    error={
                      touched.surname && Boolean(errors.surname)
                    }
                  />
                </Box>

                {/* Row 2 */}
                <Box className="flex space-x-4">
                 
                  <TextField
                    name="phoneNo"
                    label="Phone #"
                    type="text"
                    variant="outlined"
                    fullWidth
                    required
                    value={values.phoneNo}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    helperText={<ErrorMessage name="phoneNo" />}
                    error={
                      touched.phoneNo &&
                      Boolean(errors.phoneNo)
                    }
                  />
                  
                  <TextField
                    name="street"
                    label="Street"
                    type="text"
                    variant="outlined"
                    fullWidth
                    required
                    value={values.street}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    helperText={<ErrorMessage name="street" />}
                    error={
                      touched.street &&
                      Boolean(errors.street)
                    }
                  />
                  <TextField
                    name="amexCVC"
                    label="Amex CVC"
                    type="text"
                    variant="outlined"
                    fullWidth
                    required
                    value={values.amexCVC}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    helperText={<ErrorMessage name="amexCVC" />}
                    error={
                      touched.amexCVC &&
                      Boolean(errors.amexCVC)
                    }
                  />
                  <TextField
                    name="amexLast4"
                    label="Amex Last4"
                    type="text"
                    variant="outlined"
                    fullWidth
                    required
                    value={values.amexLast4}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    helperText={<ErrorMessage name="amexLast4" />}
                    error={
                      touched.amexLast4 &&
                      Boolean(errors.amexLast4)
                    }
                  />
                  <TextField
                    name="citiCVC"
                    label="Citi CVC"
                    type="text"
                    variant="outlined"
                    fullWidth
                    required
                    value={values.citiCVC}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    helperText={<ErrorMessage name="citiCVC" />}
                    error={
                      touched.citiCVC &&
                      Boolean(errors.citiCVC)
                    }
                  />
                </Box>

                {/* Row 3 */}
                <Box className="flex space-x-4">
                <TextField
                    name="citiLast4"
                    label="Citi Last4"
                    type="text"
                    variant="outlined"
                    fullWidth
                    required
                    value={values.citiLast4}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    helperText={<ErrorMessage name="citiLast4" />}
                    error={
                      touched.citiLast4 &&
                      Boolean(errors.citiLast4)
                    }
                  />
                  <TextField
                    name="city"
                    label="City"
                    type="text"
                    variant="outlined"
                    fullWidth
                    required
                    value={values.city}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    helperText={<ErrorMessage name="city" />}
                    error={
                      touched.city &&
                      Boolean(errors.city)
                    }
                  />
                   <TextField
                    name="state"
                    label="State"
                    type="text"
                    variant="outlined"
                    fullWidth
                    required
                    value={values.state}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    helperText={<ErrorMessage name="state" />}
                    error={
                      touched.state &&
                      Boolean(errors.state)
                    }
                  />
                  <TextField
                    name="zip"
                    label="ZIP"
                    type="number"
                    variant="outlined"
                    fullWidth
                    required
                    value={values.zip}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    helperText={<ErrorMessage name="zip" />}
                    error={
                      touched.zip &&
                      Boolean(errors.zip)
                    }
                  />
                </Box>

                {/* Row 5 */}
                <Box className="flex space-x-3">
                  <TextField
                    name="proxy"
                    label="Proxy"
                    type="text"
                    variant="outlined"
                    fullWidth
                    required
                    value={values.proxy}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    helperText={<ErrorMessage name="proxy" />}
                    error={touched.proxy && Boolean(errors.proxy)}
                  />
                  <TextField
                    name="takeUsCVC"
                    label="Take Us CVC"
                    type="text"
                    variant="outlined"
                    fullWidth
                    required
                    value={values.takeUsCVC}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    helperText={<ErrorMessage name="takeUsCVC" />}
                    error={touched.takeUsCVC && Boolean(errors.takeUsCVC)}
                  />
                  <TextField
                    name="takeUsLast4"
                    label="Take Us Last4"
                    type="text"
                    variant="outlined"
                    fullWidth
                    required
                    value={values.takeUsLast4}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    helperText={<ErrorMessage name="takeUsLast4" />}
                    error={touched.takeUsLast4 && Boolean(errors.takeUsLast4)}
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
                    "Add Account"
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

export default BuyingModal;
