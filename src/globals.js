// const Larak_System_URL = "http://192.168.0.103:8000/";
// const Larak_System_URL = "http://192.168.6.107:8000/";
// const Larak_System_URL = "http://app.larak.com.iq:8003/";
const Larak_System_URL = "http://localhost:8000/";
// const Larak_System_URL = "http://172.20.10.3:8000/";
// const Larak_System_URL = "http://192.168.22.48:8000/";

//format date
function FormatDateTime(date) {
  date = new Date(date);
  // Extract date components
  let year = date.getFullYear();
  let month = ("0" + (date.getMonth() + 1)).slice(-2);
  let day = ("0" + date.getDate()).slice(-2);
  let hours = date.getHours();
  let minutes = ("0" + date.getMinutes()).slice(-2);

  // Determine AM or PM suffix based on the hour
  let suffix = hours >= 12 ? "PM" : "AM";

  // Convert to 12-hour time
  hours = hours % 12 || 12;
  hours = ("0" + hours).slice(-2); // pad with zero

  return `${year}-${month}-${day} ${hours}:${minutes} ${suffix}`;
}

async function CheckToken() {
  var token = localStorage.getItem("token");

  await fetch(Larak_System_URL + "api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      if (response.status !== 200) {
        alert(response);
      }
      return response;
    })
    .catch((error) => {
      alert(error);
      return null;
    })
    .finally(() => {
      console.log("complete login api");
    });
}

export { Larak_System_URL, CheckToken, FormatDateTime };
