import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import Loading from "./pages/Loading";
import { Larak_System_URL } from "./globals";
import LoginPage from "./pages/Login";
import NoPage from "./pages/NoPage";
import BikerOrdersPage from "./pages/client/orders";
import ClientProfileDetailsPage from "./pages/client/profileDetails";
import "leaflet/dist/leaflet.css";
import OrderDetailsPage from "./pages/client/order_details";
import ClientProfilePage from "./pages/client/profile";
import BikerCurrentOrdersPage from "./pages/client/current_orders";
import CompleteOrderDetailsPage from "./pages/client/complete_order_details";
function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);

  async function getSavedUserInLocalStorage() {
    setLoading(true);

    var token = localStorage.getItem("token") ?? "";

    if (token === null || token === "") {
      setLoggedIn(false);
      setLoading(false);
      return;
    }

    fetch(Larak_System_URL + "user-info/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.detail) {
          // alert(data.detail);
          setLoggedIn(false);
          // console.log(setLoggedIn);

          return;
        }
        setLoggedIn(true);
      })
      .catch((error) => {
        alert(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    getSavedUserInLocalStorage();
    // Add event listeners for online/offline events
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Clean up event listeners when the component unmounts
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <>
      {isOnline ? (
        <div style={{ height: "100vh", width: window.innerWidth }}>
          <BrowserRouter>
            <Routes>
              <Route
                path="/"
                element={
                  loading ? (
                    <Loading />
                  ) : loggedIn ? (
                    <BikerOrdersPage />
                  ) : (
                    <LoginPage />
                  )
                }
              />

              <Route path="/biker_orders" element={<BikerOrdersPage />} />
              <Route
                path="/biker_current_orders"
                element={<BikerCurrentOrdersPage />}
              />
              <Route
                path="/client_order_details"
                element={<OrderDetailsPage />}
              />
              <Route
                path="/complete_order_details"
                element={<CompleteOrderDetailsPage />}
              />
              <Route path="/client_profile" element={<ClientProfilePage />} />
              {/* <Route
                path="/client_profile_details"
                element={<ClientProfileDetailsPage />}
              /> */}

              <Route path="/login" element={<LoginPage />} />

              <Route path="*" element={<NoPage />} />
            </Routes>
          </BrowserRouter>
        </div>
      ) : (
        <div
          className="container text-center text-danger border rounded  mt-4 d-flex"
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: window.innerHeight,
          }}
        >
          <p> لايوجد اتصال انترنت </p>
        </div>
      )}
    </>
  );
}

export default App;
