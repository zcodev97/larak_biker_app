// import { useState, useEffect, useRef } from "react";
// import NavBar from "../../components/navbar";
// import { useNavigate } from "react-router-dom";
// import Map from "ol/Map";
// import XYZ from "ol/source/XYZ";
// import View from "ol/View";
// import Feature from "ol/Feature";
// import Point from "ol/geom/Point";
// import { Draw } from "ol/interaction";
// import VectorSource from "ol/source/Vector";
// import VectorLayer from "ol/layer/Vector";
// import TileLayer from "ol/layer/Tile";
// import OSM from "ol/source/OSM";
// import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style";
// import { fromLonLat, transform } from "ol/proj";
// import Circle from "ol/geom/Circle";
// import Icon from "ol/style/Icon";
// import { Larak_System_URL } from "../../globals";

// function MapComponent() {
//   const mapRef = useRef(null);
//   const [map, setMap] = useState(null);

//   useEffect(() => {
//     const vectorSource = new VectorSource();
//     const vectorLayer = new VectorLayer({
//       source: vectorSource,
//       style: new Style({
//         image: new Icon({
//           anchor: [0.5, 1],
//           src: "https://openlayers.org/en/latest/examples/data/icon.png",
//         }),
//       }),
//     });

//     const initialMap = new Map({
//       target: mapRef.current,
//       layers: [
//         new TileLayer({
//           source: new XYZ({
//             url: "https://{1-4}.base.maps.api.here.com/maptile/2.1/maptile/newest/normal.day/{z}/{x}/{y}/256/png8?app_id=aWkeLP21AKVpB5R5JZ3I&app_code=tmLcVPJ_CRu8j1Uq_4Y-ag",
//             crossOrigin: "anonymous",
//           }),
//           visible: true,
//         }),
//         vectorLayer,
//       ],
//       view: new View({
//         center: fromLonLat([
//           parseFloat(44.3852922139959),
//           parseFloat(33.32711910085179),
//         ]),
//         zoom: 15,
//       }),
//     });

//     setMap(initialMap);

//     return () => {
//       if (initialMap) {
//         initialMap.setTarget(null);
//       }
//     };
//   }, []);

//   useEffect(() => {
//     if (!map) return;

//     getSavedLocation();

//     const draw = new Draw({
//       source: map.getLayers().array_[1].getSource(),
//       type: "Point",
//       maxPoints: 1,
//     });

//     draw.on("drawend", function (event) {
//       const vectorSource = map.getLayers().array_[1].getSource();
//       vectorSource.clear(); // Clear existing features before adding a new one
//       const feature = event.feature;
//       const coords = feature.getGeometry().getCoordinates();
//       const lonLatCoords = transform(coords, "EPSG:3857", "EPSG:4326");
//       console.log("Selected point coordinates (lon/lat):", lonLatCoords);
//       localStorage.setItem("lon", lonLatCoords[0]);
//       localStorage.setItem("lat", lonLatCoords[1]);
//       // No need to manually add the feature, as it's already added by the Draw interaction
//     });

//     map.addInteraction(draw);

//     return () => {
//       map.removeInteraction(draw);
//     };
//   }, [map]);

//   const getCurrentLocation = () => {
//     if ("geolocation" in navigator) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           const coords = [position.coords.longitude, position.coords.latitude];
//           const view = map.getView();
//           view.setCenter(fromLonLat(coords));
//           view.setZoom(15);

//           const locationFeature = new Feature({
//             geometry: new Point(fromLonLat(coords)),
//           });
//           const vectorSource = map.getLayers().array_[1].getSource();
//           vectorSource.clear(); // Clear existing features before adding a new one
//           vectorSource.addFeature(locationFeature); // Add the new location feature

//           localStorage.setItem("lon", position.coords.longitude);
//           localStorage.setItem("lat", position.coords.latitude);
//         },
//         (error) => {
//           console.error("Error getting location:", error);
//         },
//         {
//           enableHighAccuracy: true, // Request high accuracy
//         }
//       );
//     } else {
//       console.error("Geolocation is not supported by this browser.");
//     }
//   };

//   const getSavedLocation = () => {
//     const coords = [localStorage.getItem("lon"), localStorage.getItem("lat")];
//     const view = map.getView();
//     view.setCenter(fromLonLat(coords));
//     view.setZoom(15);

//     const locationFeature = new Feature({
//       geometry: new Point(fromLonLat(coords)),
//     });
//     const vectorSource = map.getLayers().array_[1].getSource();
//     vectorSource.clear(); // Clear existing features before adding a new one
//     vectorSource.addFeature(locationFeature); // Add the new location feature
//   };

//   return (
//     <div>
//       <div
//         ref={mapRef}
//         style={{
//           width: window.innerWidth / 1.2,
//           height: window.innerHeight / 2,
//         }}
//         className="container rounded"
//       ></div>
//       <div className="container text-center">
//         <button
//           className="btn p-2 mt-2 border rounded"
//           onClick={getCurrentLocation}
//           style={{
//             fontSize: "20px",
//             color: "#ff8000",
//             fontWeight: "bold",
//           }}
//         >
//           👆 موقعي الحالي
//         </button>
//       </div>
//     </div>
//   );
// }

// function ClientProfileDetailsPage() {
//   const [loading, setLoading] = useState(false);
//   const [firstName, setFirstName] = useState("");
//   const [lastName, setLastName] = useState("");
//   const [location, setLocation] = useState("");
//   const navigate = useNavigate();
//   const [position, setPosition] = useState(null);
//   const [data, setData] = useState([]);

//   async function loadData() {
//     setLoading(true);
//     await fetch(
//       Larak_System_URL + "get_user_info/" + localStorage.getItem("username_id"),
//       {
//         method: "GET",
//         headers: {
//           accept: "application/json",
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       }
//     )
//       .then((response) => response.json())
//       .then((data) => {
//         if (data.detail === "Given token not valid for any token type") {
//           navigate("/login", { replace: true });
//           return;
//         }
//         if (data.detail) {
//           alert(data.detail);
//           return;
//         }

//         setFirstName(data?.first_name);
//         setLastName(data?.last_name);
//         setLocation(data?.location);

//         setData(data);
//       })
//       .catch((error) => {
//         alert(error);
//       })
//       .finally(() => {
//         setLoading(false);
//       });
//   }

//   async function submitUserInfo() {
//     setLoading(true);

//     await fetch(Larak_System_URL + "add_user_info/", {
//       method: "POST",
//       headers: {
//         accept: "application/json",
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${localStorage.getItem("token")}`,
//       },
//       body: JSON.stringify({
//         user: localStorage.getItem("username_id"),
//         first_name: firstName,
//         last_name: lastName,
//         location: location,
//         lon: localStorage.getItem("lon"),
//         lat: localStorage.getItem("lat"),
//       }),
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         if (data.detail) {
//           alert(data.detail);
//           return;
//         }
//       })
//       .catch((error) => {
//         alert(error);
//       })
//       .finally(() => {
//         setLoading(false);
//       });
//   }

//   useEffect(() => {
//     loadData();
//   }, []);

//   return (
//     <>
//       <NavBar />

//       <p
//         className=" pt-4  text-center "
//         style={{ fontWeight: "bold", fontSize: "24px" }}
//       >
//         تفاصيل المستخدم
//       </p>

//       <div
//         className="container-fluid"
//         style={{
//           float: "right",
//           overflowY: "auto",
//           height: window.innerHeight - 125,
//         }}
//       >
//         <p
//           className=" pt-4  text-center "
//           style={{ fontWeight: "bold", fontSize: "16px" }}
//         >
//           الاسم الاول
//         </p>
//         <div className="container-fluid">
//           <input
//             // value={data?.first_name ?? ""}
//             defaultValue={data?.first_name ?? ""}
//             type="text"
//             className="form-control text-center"
//             style={{
//               backgroundColor: "#e6e6e6",
//               fontSize: "20px",
//               padding: "20px",
//             }}
//             id="phone"
//             placeholder="الاسم الاول"
//             name="phone"
//             onChange={(e) => {
//               setFirstName(e.target.value);
//             }}
//           />
//         </div>
//         <hr />
//         <p
//           className=" pt-4  text-center "
//           style={{ fontWeight: "bold", fontSize: "16px" }}
//         >
//           الاسم الاخير
//         </p>
//         <div className="container-fluid">
//           <input
//             defaultValue={data?.last_name ?? ""}
//             type="text"
//             className="form-control text-center"
//             style={{
//               backgroundColor: "#e6e6e6",
//               fontSize: "20px",
//               padding: "20px",
//             }}
//             id="phone"
//             placeholder="الاسم الاخير"
//             name="phone"
//             onChange={(e) => {
//               setLastName(e.target.value);
//             }}
//           />
//         </div>
//         <hr />
//         <p
//           className=" pt-4  text-center "
//           style={{ fontWeight: "bold", fontSize: "16px" }}
//         >
//           الموقع كتابتا
//         </p>
//         <div className="container-fluid">
//           <input
//             defaultValue={data?.location ?? ""}
//             type="text"
//             className="form-control text-center"
//             style={{
//               backgroundColor: "#e6e6e6",
//               fontSize: "20px",
//               padding: "20px",
//             }}
//             id="phone"
//             placeholder="الموقع كتابتا"
//             name="locaiton"
//             onChange={(e) => {
//               setLocation(e.target.value);
//             }}
//           />
//         </div>
//         <hr />

//         <div className="container mt-2 text-center">
//           <div
//             className="container p-2"
//             style={{
//               fontSize: "20px",
//               color: "#ff8000",
//               fontWeight: "bold",
//             }}
//           >
//             <b> الموقع </b>
//           </div>
//         </div>

//         <MapComponent />

//         <div className="container   p-2 text-center">
//           <div
//             className="btn border rounded"
//             style={{
//               fontSize: "20px",
//               color: "#ff8000",
//               fontWeight: "bold",
//             }}
//             onClick={() => {
//               // console.log(
//               //   firstName.length === 0 && data[0]?.first_name.length === 0
//               // );

//               // if (firstName.length !== 0 && data[0]?.first_name.length !== 0) {
//               //   alert("الرجاء تحديد الاسم الاول");
//               //   return;
//               // }
//               // if (lastName.length === 0 && data[0]?.last_name.length === 0) {
//               //   alert("الرجاء تحديد الاسم الاخير");
//               //   return;
//               // }
//               // if (location.length === 0 && data[0]?.location.length === 0) {
//               //   alert("الرجاء تحديد الموقع كتابتا");
//               //   return;
//               // }
//               if (
//                 localStorage.getItem("lon").length === 0 &&
//                 localStorage.getItem("lat").length === 0
//               ) {
//                 alert("على الخريطة الرجاء تحديد الموقع");
//                 return;
//               }

//               submitUserInfo();
//             }}
//           >
//             ✅ حفظ
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// export default ClientProfileDetailsPage;
