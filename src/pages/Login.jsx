import { useState, React, useEffect } from "react";
import Loading from "./Loading";
import { useNavigate } from "react-router-dom";
import { Larak_System_URL } from "../globals";
import LarakLogo from "../components/logo_larak.png";
function LoginPage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function checkIfUsernameAndPasswordIsCorrect() {
    setLoading(true);
    await fetch(Larak_System_URL + "login/", {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.detail) {
          alert(data.detail);
          setLoading(false);
          return;
        }
        console.log(data);
        window.username = data.user.username;
        window.username_id = data.user.id;
        // window.groups = data.user.groups[0];
        localStorage.setItem("token", data.access);
        localStorage.setItem("username", data.user.username);
        localStorage.setItem("username_id", data.user.id);

        localStorage.setItem("user_type", data.user.user_type);
        localStorage.setItem("supervisor", data.user.supervisor);

        navigate("/client_products", { replace: true });
      })
      .catch((error) => {
        alert(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  const handleUsername = (event) => {
    setUsername(event.target.value);
  };

  const handlePassword = (event) => {
    setPassword(event.target.value);
  };

  if (loading) return <Loading />;

  return (
    <>
      <div
        style={{
          backgroundColor: "#de3d33",
          width: "100vw",
          height: "100vh",
          margin: "0px",
          marginLeft: "-8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <form>
          <div className="container-fluid  text-center text-dark">
            <div className="container    rounded-circle">
              <img src={LarakLogo} alt="" srcset="" width={250} />
            </div>

            <div
              className="container text-center text-light"
              style={{ fontSize: "28px" }}
            >
              Biker App
            </div>
            <div className="row d-flex justify-content-center align-items-center pt-4  m-1">
              <div className="col-md-6 m-1">
                <div className="container-fluid">
                  <input
                    maxLength={11}
                    type="tel"
                    className="form-control text-center"
                    style={{
                      backgroundColor: "#e6e6e6",
                      fontSize: "20px",
                      padding: "20px",
                    }}
                    id="phone"
                    placeholder="رقم الهاتف"
                    name="phone"
                    onChange={handleUsername}
                  />
                </div>
              </div>

              <div className="col-md-6 m-1">
                <div className="container-fluid">
                  <input
                    type="password"
                    className="form-control text-center"
                    style={{
                      backgroundColor: "#e6e6e6",
                      fontSize: "20px",
                      padding: "20px",
                      marginBottom: "20px",
                      marginTop: "20px",
                    }}
                    id="pwd"
                    placeholder="كلمة السر"
                    name="pswd"
                    onChange={handlePassword}
                  />
                </div>
              </div>
            </div>

            <button
              className="btn p-4"
              style={{ color: "white", fontSize: "20px" }}
              onClick={() => {
                if (
                  username === undefined ||
                  (username === "" && password === undefined) ||
                  password === ""
                ) {
                  alert("ادخل معلومات المستخدم");
                  return;
                }
                checkIfUsernameAndPasswordIsCorrect();
              }}
              onKeyDown={() => {
                if (
                  username === undefined ||
                  (username === "" && password === undefined) ||
                  password === ""
                ) {
                  alert("ادخل معلومات المستخدم");
                  return;
                }
                checkIfUsernameAndPasswordIsCorrect();
              }}
            >
              <b style={{ fontWeight: "bold" }}> دخول</b>
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default LoginPage;
