import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/navbar";
import { FormatDateTime, Larak_System_URL } from "../../globals";

import { useRef, useEffect, useState } from "react";
import { fromLonLat, transform } from "ol/proj";
import Map from "ol/Map";
import XYZ from "ol/source/XYZ";
import View from "ol/View";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { Draw } from "ol/interaction";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import TileLayer from "ol/layer/Tile";
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style";
import Icon from "ol/style/Icon";
function MapComponent(location) {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);

  useEffect(() => {
    const vectorSource = new VectorSource();
    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: new Style({
        image: new Icon({
          anchor: [0.5, 1],
          src: "https://openlayers.org/en/latest/examples/data/icon.png",
        }),
      }),
    });

    const initialMap = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new XYZ({
            url: "https://{1-4}.base.maps.api.here.com/maptile/2.1/maptile/newest/normal.day/{z}/{x}/{y}/256/png8?app_id=aWkeLP21AKVpB5R5JZ3I&app_code=tmLcVPJ_CRu8j1Uq_4Y-ag",
            crossOrigin: "anonymous",
          }),
          visible: true,
        }),
        vectorLayer,
      ],
      view: new View({
        center: fromLonLat([
          parseFloat(44.3852922139959),
          parseFloat(33.32711910085179),
        ]),
        zoom: 15,
      }),
    });

    setMap(initialMap);

    return () => {
      if (initialMap) {
        initialMap.setTarget(null);
      }
    };
  }, []);

  useEffect(() => {
    if (!map) return;

    getSavedLocation();

    const draw = new Draw({
      source: map.getLayers().array_[1].getSource(),
      type: "Point",
      maxPoints: 1,
    });

    return () => {
      map.removeInteraction(draw);
    };
  }, [map]);

  const getSavedLocation = () => {
    const coords = [location.location[0], location.location[1]];
    const view = map.getView();
    view.setCenter(fromLonLat(coords));
    view.setZoom(15);

    const locationFeature = new Feature({
      geometry: new Point(fromLonLat(coords)),
    });
    const vectorSource = map.getLayers().array_[1].getSource();
    vectorSource.clear(); // Clear existing features before adding a new one
    vectorSource.addFeature(locationFeature); // Add the new location feature
  };

  return (
    <div
      ref={mapRef}
      style={{
        width: "400px",
        height: "400px",
      }}
    ></div>
  );
}

function OrderDetailsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  let x = location.state.cart?.map((i) => i.price * i.amount);

  let totalPrice = x.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );

  async function updateOrder(title) {
    setLoading(true);

    let status = location.state.status;

    if (title) {
      status.biker_status.delivered = true;
      status.arrived_status = true;
      status.biker_status.accepted_date = new Date();
    } else {
      status.biker_status.delivered = false;
      status.arrived_status = false;
      status.biker_status.rejected_date = new Date();
    }

    let dataTosend = JSON.stringify({
      status: status,
    });

    await fetch(Larak_System_URL + "update_order/" + location.state.id, {
      method: "PATCH",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: dataTosend,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.detail === "Given token not valid for any token type") {
          navigate("/login", { replace: true });
          return;
        }
        if (data.detail) {
          alert(data.detail);
          return;
        }
      })
      .catch((error) => {
        alert(error);
      })
      .finally(() => {
        setLoading(false);
      });
    window.cart = undefined;
    setLoading(false);
    navigate("/biker_orders", { replace: true });
  }

  return (
    <>
      <NavBar />

      <div
        className="container"
        style={{
          height: window.innerHeight - 85,
          overflowY: "auto",
        }}
      >
        <div style={{ margin: "10px" }}>
          <MapComponent location={location.state.status.client.map_location} />
        </div>
        <div
          className="container text-center d-flex justify-content-center align-items-center"
          style={{ fontSize: "20px", margin: "5px", padding: "5px" }}
        >
          <b className="p-2">{location.state.order_id}</b>

          <b className="p-2"> رقم الطلب</b>
        </div>

        <div
          className="container text-center d-flex justify-content-center align-items-center"
          style={{ fontSize: "20px" }}
        >
          <p className="pr-2">
            {totalPrice.toLocaleString("en-US", {
              style: "currency",
              currency: "IQD",
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
            })}
          </p>
          <p>المبلغ الكلي</p>
        </div>
        <div
          className="container text-center d-flex justify-content-center align-items-center"
          style={{ fontSize: "20px" }}
        >
          <p className="pr-2">{FormatDateTime(location.state.created_at)}</p>
          <p>تاريخ الطلب</p>
        </div>

        <div className="container">
          <table
            className="table "
            style={{ fontSize: "16px", fontWeight: "normal" }}
          >
            <tbody>
              {location.state.cart?.map((i) => (
                <tr className="text-center">
                  <td className="">
                    <div className="container d-flex justify-content-end align-items-center">
                      <p className="p-2">
                        {i.title}
                        <p>
                          {(i.price * i.amount).toLocaleString("en-US", {
                            style: "currency",
                            currency: "IQD",
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 2,
                          })}
                        </p>
                        <p>{i.amount}</p>
                      </p>

                      <img
                        className="rounded-circle"
                        src={i.image}
                        width={75}
                        alt=""
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            <div
              className="container text-center"
              style={{ display: "flex", justifyContent: "space-around" }}
            >
              <button
                className="btn btn-success "
                style={{ fontSize: "18px" }}
                onClick={() => {
                  updateOrder(true);
                }}
              >
                تم التوصيل
              </button>

              <button
                className="btn btn-danger "
                style={{ fontSize: "18px" }}
                onClick={() => {
                  updateOrder(false);
                }}
              >
                لم يتم التوصيل
              </button>
            </div>
          </table>
        </div>
      </div>
    </>
  );
}

export default OrderDetailsPage;
