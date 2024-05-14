import { useEffect, useState } from "react";
import NavBar from "../../components/navbar";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { FormatDateTime, Larak_System_URL } from "../../globals";
import Loading from "../Loading";
import "@flaticon/flaticon-uicons/css/all/all.css"; // Import Flaticon CSS

function BikerOrdersPage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  async function clientOrders() {
    setLoading(true);

    await fetch(Larak_System_URL + "api/biker-orders/", {
      method: "GET",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.detail) {
          navigate("/login", { replace: true });
          return;
        }
        if (data.detail) {
          alert(data.detail);
          return;
        }
        console.log(data.results);
        setData(data.results);
      })
      .catch((error) => {
        alert(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    clientOrders();
  }, []);

  return (
    <>
      <NavBar />
      {loading ? (
        <Loading />
      ) : data?.length !== 0 ? (
        <div
          className="container-fluid"
          style={{
            height: window.innerHeight - 85,
            overflowY: "auto",
          }}
        >
          <table
            className="table text-center"
            style={{
              borderCollapse: "separate",
              borderSpacing: "0 15px",
            }}
          >
            <tbody style={{ fontSize: "16px" }}>
              {data?.map((d) => (
                <tr
                  key={d.id}
                  className="text-center"
                  style={{
                    borderTop: "0px",
                    borderRadius: "10px",
                    boxShadow: "4px 4px 4px  #e6e6e6",
                    margin: "5px",
                  }}
                  onClick={() => {
                    navigate("/complete_order_details", { state: d });
                  }}
                >
                  <td className="text-end">
                    <b> {d.order_id} </b> رقم الطلب
                    <p>{FormatDateTime(d.created_at)}</p>
                    <p>{d?.status?.biker_status.delivered}</p>
                    <p>
                      {d?.status?.biker_status.delivered
                        ? "تم التوصيل"
                        : "لم يتم التوصيل"}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div
          className="container"
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: window.innerHeight,
          }}
        >
          <i
            className="fi fi-rs-person-dolly-empty"
            style={{ fontSize: "50px" }}
          ></i>
        </div>
      )}
    </>
  );
}

export default BikerOrdersPage;
