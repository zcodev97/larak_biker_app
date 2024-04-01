import { useState } from "react";
import NavBar from "../../components/navbar";
import { useNavigate } from "react-router-dom";

function ClientProfilePage() {
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(false);
  const navigate = useNavigate();

  async function handleLogout() {
    setLoading(true);
    localStorage.clear();
    setLoading(false);
    navigate("/login", { replace: true });
  }

  return (
    <>
      <NavBar />

      <div className="container-fluid">
        <p
          className="pt-4  text-end "
          style={{ fontWeight: "bold", fontSize: "24px" }}
        >
          الاعدادات
        </p>
        <p
          className=" pt-4  text-end "
          style={{ fontWeight: "bold", fontSize: "20px" }}
        >
          <b>{localStorage.getItem("username")}</b>
        </p>

        <div
          className="container text-center mt-4"
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            position: "absolute",
            bottom: "0",
            left: "0",
            marginBottom: "80px",
          }}
        >
          <div className="container  text-center p-4">
            {localStorage.getItem("user_type")}
          </div>

          <div
            className="container btn btn-danger text-light p-3"
            onClick={handleLogout}
            style={{ fontSize: "20px" }}
          >
            <b> خروج </b>
          </div>
        </div>
      </div>
    </>
  );
}

export default ClientProfilePage;
