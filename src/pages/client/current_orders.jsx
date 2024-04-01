import { useEffect, useState } from "react";
import NavBar from "../../components/navbar";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { FormatDateTime, Larak_System_URL } from "../../globals";
import Loading from "../Loading";
import "@flaticon/flaticon-uicons/css/all/all.css"; // Import Flaticon CSS
import { useRef } from "react";
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
function MapComponent() {
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

    draw.on("drawend", function (event) {
      const vectorSource = map.getLayers().array_[1].getSource();
      vectorSource.clear(); // Clear existing features before adding a new one
      const feature = event.feature;
      const coords = feature.getGeometry().getCoordinates();
      const lonLatCoords = transform(coords, "EPSG:3857", "EPSG:4326");
      console.log("Selected point coordinates (lon/lat):", lonLatCoords);
      localStorage.setItem("lon", lonLatCoords[0]);
      localStorage.setItem("lat", lonLatCoords[1]);
      // No need to manually add the feature, as it's already added by the Draw interaction
    });

    map.addInteraction(draw);

    return () => {
      map.removeInteraction(draw);
    };
  }, [map]);

  const getCurrentLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = [position.coords.longitude, position.coords.latitude];
          const view = map.getView();
          view.setCenter(fromLonLat(coords));
          view.setZoom(15);

          const locationFeature = new Feature({
            geometry: new Point(fromLonLat(coords)),
          });
          const vectorSource = map.getLayers().array_[1].getSource();
          vectorSource.clear(); // Clear existing features before adding a new one
          vectorSource.addFeature(locationFeature); // Add the new location feature

          localStorage.setItem("lon", position.coords.longitude);
          localStorage.setItem("lat", position.coords.latitude);
        },
        (error) => {
          console.error("Error getting location:", error);
        },
        {
          enableHighAccuracy: true, // Request high accuracy
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  const getSavedLocation = () => {
    const coords = [localStorage.getItem("lon"), localStorage.getItem("lat")];
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
        width: window.innerWidth / 1.2,
        height: window.innerHeight / 2,
      }}
      className="container rounded"
    ></div>
  );
}

function BikerCurrentOrdersPage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  async function clientOrders() {
    setLoading(true);

    await fetch(Larak_System_URL + "api/biker-current-orders/", {
      method: "GET",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
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
        console.log(data);
        setData(data);
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
              {data.reverse().map((d) => (
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
                    navigate("/client_order_details", { state: d });
                  }}
                >
                  <td className="text-center">
                    <p>
                      <b>{d?.status?.client.firstname}</b>
                    </p>
                    <b>{d?.status?.client.username}</b>
                    <hr />
                    <b> {d.order_id} </b> رقم الطلب
                    <p>{FormatDateTime(d.created_at)}</p>
                    <b>{d?.status?.client.text_location}</b>
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

export default BikerCurrentOrdersPage;
