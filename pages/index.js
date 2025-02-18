import { useContext, useRef, useState } from "react";
import { useRouter } from "next/router";
import { Snackbar, Alert, CircularProgress, IconButton } from "@mui/material";
import { fetchApi } from "../fetchApi";
import { UserContext } from "../components/UserContext";
import Cookies from "js-cookie";
import { Formik } from "formik";
import { loginValidation } from "../utils/validation";
import { useTheme } from "../context/themeContext"; // Import the useTheme hook
import { Brightness4, Brightness7 } from "@mui/icons-material"; // Icons for theme toggle

export default function Login() {
  const { setIsAuthenticated } = useContext(UserContext);
  const { theme, toggleTheme } = useTheme(); // Use the theme context
  const router = useRouter();
  const email = useRef();
  const password = useRef();
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const LoginSubmit = async (e) => {
    setLoading(true);

    const [data, error] = await fetchApi({
      method: "POST",
      endPoint: "User/login",
      data: {
        email: email.current.value,
        password: password.current.value,
      },
    });
    setLoading(false);

    if (data.isSuccess === false) {
      let errorMessage = "An error occurred. Please try again.";
      if (data.message) {
        errorMessage = data.message;
      }

      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
      return;
    }

    Cookies.set("ajs_anonymous_id", data?.data?.token, { path: "/" });
    localStorage.setItem("token", data?.data?.token);
    localStorage.setItem("user", data?.email);

    setIsAuthenticated(true);

    setSnackbar({
      open: true,
      message: "Login successful!",
      severity: "success",
    });

    router.push("/admin");
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <div
      className={`flex justify-center items-center min-h-screen w-full overflow-hidden ${
        theme === "dark" ? "text-white" : "text-black"
      }`}
    >
      <div className="w-[670px] max-w-4xl p-8 ml-14">
        {/* Separate div for the Toggle Button */}
        <div className="flex justify-end ">
          <IconButton onClick={toggleTheme} color="inherit">
            {theme === "light" ? <Brightness4 /> : <Brightness7 />}
          </IconButton>
        </div>

        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          validationSchema={loginValidation}
          onSubmit={(values) => LoginSubmit(values)}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
          }) => (
            <form
              onSubmit={handleSubmit}
              className={`space-y-4 rounded-2xl p-8 h-[500px] flex flex-col`}
            >
              <h3
                className={`text-4xl text-center mb-8 font-bold ${
                  theme === "dark" ? "text-white" : "text-gray-950"
                }`}
              >
                Sign In
              </h3>
              <h5
                className={`text-xl text-center font-medium ${
                  theme === "dark" ? "text-white" : "text-gray-950"
                }`}
              >
                Enter Your email and Password to Sign In
              </h5>
              <div>
                <label
                  className={`block mb-2 text-lg mt-10 font-bold ${
                    theme === "dark" ? "text-white" : "text-gray-950"
                  }`}
                >
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`bg-gray-100 h-12 text-gray-950 text-sm rounded-lg block w-full p-2.5 ${
                    theme === "dark" ? "bg-gray-950" : "bg-gray-100"
                  }`}
                  placeholder="name@company.com"
                  ref={email}
                  value={values.email}
                />
              </div>
              {errors.email && touched.email && (
                <div className="text-red-500">{errors.email}</div>
              )}
              <div>
                <label
                  className={`block mb-2 text-lg font-bold ${
                    theme === "dark" ? "text-white" : "text-gray-950"
                  }`}
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.password}
                  placeholder="••••••••"
                  className={`bg-gray-100 h-12 text-gray-950 text-sm rounded-lg block w-full p-2.5 ${
                    theme === "dark" ? "bg-gray-950" : "bg-gray-100"
                  }`}
                  ref={password}
                />
              </div>
              {errors.password && touched.password && (
                <div className="text-red-500">{errors.password}</div>
              )}
              <div className="flex items-start">
                <input type="checkbox" className="mr-2 mt-1" />
                <label
                  className={`text-md font-medium mb-2 text-gray-950${
                    theme === "dark" ? "bg-gray-950" : "bg-gray-100"
                  }`}
                >
                  Remember me
                </label>
              </div>
              <button
                type="submit"
                disabled={loading}
                className={`w-[500px] ml-11 font-medium rounded-lg text-xl px-5 py-2.5 text-center ${
                  loading
                    ? "bg-gray-800 cursor-not-allowed"
                    : "bg-gray-500 hover:bg-gray-800"
                } text-white`}
              >
                {loading ? (
                  <CircularProgress size={18} color="inherit" />
                ) : (
                  "Login"
                )}
              </button>
            </form>
          )}
        </Formik>
      </div>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
