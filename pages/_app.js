import "../styles/globals.css";
import { Provider, useDispatch, useSelector } from "react-redux";
import Layout from "../components/Layout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState, useEffect } from "react";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import { wrapper, store } from "../components/redux/store/index";
import { UserContext } from "../components/UserContext";
import { ThemeProvider } from "../context/themeContext";

function MyApp({ Component, pageProps }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  let persistor = persistStore(store);
  // if (typeof window !== 'undefined') {
  //   window.$ = window.jQuery = require('jquery');
  //   window.signalR = require('@microsoft/signalr');
  // }
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <ThemeProvider>
      <UserContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
        <Provider store={store}>
          {" "}
          <Layout>
            <ToastContainer
              position="top-right"S
              autoClose={2000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
            <Component {...pageProps} />
          </Layout>
        </Provider>
      </UserContext.Provider>
    </ThemeProvider>
  );
}

export default MyApp;
