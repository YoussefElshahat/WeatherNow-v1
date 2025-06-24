const searchInput = document.querySelector("#searchInput");
const cardGroup = document.querySelector(".card-group");
const apiKey = "f766eda6068a4c838f761922252106";

const week = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const daysOfMonth = Array.from({ length: 31 }, (_, i) => i + 1);

function getWeather(locationQuery) {
  const myRequest = new XMLHttpRequest();
  myRequest.open(
    "GET",
    `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${locationQuery}&days=3`
  );
  myRequest.send();

  myRequest.addEventListener("readystatechange", function () {
    if (myRequest.readyState === 4 && myRequest.status === 200) {
      const data = JSON.parse(myRequest.response);
      const date = new Date(data.location.localtime_epoch * 1000);
      const dayIndex = date.getDay();

      const cardOne = `
        <div class="card light-card">
          <div class="card-header d-flex justify-content-between">
            <span>${week[dayIndex]}</span>
            <span>${daysOfMonth[date.getDate() - 1]} ${
        months[date.getMonth()]
      }</span>
          </div>
          <div class="card-body">
            <p class="py-2">${data.location.name}</p>
            <h3 id="card-one-temp" class="py-2">${data.current.temp_c}°C</h3>
            <img src="https:${data.current.condition.icon}" alt="">
            <span>${data.current.condition.text}</span>
          </div>
          <div class="card-footer d-flex justify-content-between">
            <span>${
              data.forecast.forecastday[0].day.daily_chance_of_rain
            }%</span>
            <span>${data.current.wind_kph} km/h</span>
            <span>${data.current.wind_dir}</span>
          </div>
        </div>`;

      const cardTwo = `
        <div class="card text-center dark-card">
          <div class="card-header"><span>${
            week[(dayIndex + 1) % 7]
          }</span></div>
          <div class="card-body">
            <p class="py-1">${data.location.name}</p>
            <h3 class="py-1">${
              data.forecast.forecastday[1].day.maxtemp_c
            }°C</h3>
            <h3 class="py-1">${
              data.forecast.forecastday[1].day.mintemp_c
            }°C</h3>
            <img src="https:${
              data.forecast.forecastday[1].day.condition.icon
            }" alt="">
            <span>${data.forecast.forecastday[1].day.condition.text}</span>
          </div>
        </div>`;

      const cardThree = `
        <div class="card text-center light-card ">
          <div class="card-header"><span>${
            week[(dayIndex + 2) % 7]
          }</span></div>
          <div class="card-body">
            <p class="py-1">${data.location.name}</p>
            <h3 class="py-1">${
              data.forecast.forecastday[2].day.maxtemp_c
            }°C</h3>
            <h3 class="py-1">${
              data.forecast.forecastday[2].day.mintemp_c
            }°C</h3>
            <img src="https:${
              data.forecast.forecastday[2].day.condition.icon
            }" alt="">
            <span>${data.forecast.forecastday[2].day.condition.text}</span>
          </div>
        </div>`;

      cardGroup.innerHTML = cardOne + cardTwo + cardThree;
    }
  });
}

// ✅ Try to get user location
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    function (position) {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      getWeather(`${lat},${lon}`);
    },
    function (error) {
      console.error("Geolocation error:", error.message);
      getWeather("Cairo"); // fallback if permission denied
    }
  );
} else {
  console.log("Geolocation not supported");
  getWeather("egypt"); // fallback
}

// ✅ Debounced input search
let debounceTimer;
searchInput.addEventListener("input", function () {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    const value = searchInput.value.trim();
    if (value.length > 0) {
      getWeather(value);
    }
  }, 500);
});
