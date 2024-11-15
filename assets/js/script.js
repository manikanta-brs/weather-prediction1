function setTheme(theme) {
  document.documentElement.style.setProperty("--primary-color", theme);
  localStorage.setItem("iss-theme", theme);
}

setTheme(localStorage.getItem("iss-theme") || defaultColor);

window.onload = function () {
  document.querySelector(".input-search").value = "";
};

const api_details = {
  url: "https://api.openweathermap.org/data/2.5/",
  api_key: "60bbd59ec7556e88c0f6b5a2080aebaa",
};

const input = document.querySelector(".input-search");
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.keyCode === 32) {
    if (input.value.trim() === "") {
      alert("Please enter a valid city name.");
      return;
    }
    // console.log(`Fetching data for: ${input.value}`);
    showResults(input.value.trim());
  }
});

async function showResults(value) {
  try {
    const response = await fetch(
      `${api_details.url}weather?q=${value}&units=metric&APPID=${api_details.api_key}`
    );
    const data = await response.json();
    // console.log(data); // Debugging

    if (data.cod === "404") {
      displayCityNotFound();
    } else {
      displayData(data);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

function displayCityNotFound() {
  document.querySelector(".location-city").innerText = null;
  document.querySelector(".location-date").innerText = null;
  document.querySelector(".temperature-temp").innerHTML = null;
  document.querySelector(".temperature-type").innerText = null;

  document.getElementById("city_not_found")?.remove();

  const ele = document.createElement("h2");
  ele.className = "heady";
  ele.setAttribute("id", "city_not_found");
  ele.textContent = "City Not Found";

  document.querySelector(".temperature").appendChild(ele);
}

function displayData(data) {
  document.getElementById("city_not_found")?.remove();

  const location_city = document.querySelector(".location-city");
  location_city.innerText = `${data.name}, ${data.sys.country}`;

  const time = new Date();
  const date = document.querySelector(".location-date");
  const months_year = [
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
  const days_week = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  date.innerText = `${days_week[time.getDay()]} ${time.getDate()} ${
    months_year[time.getMonth()]
  } ${time.getFullYear()}`;

  const tempp = document.querySelector(".temperature-temp");
  tempp.innerHTML = `${Math.round(data.main.temp)}<span>&#730C</span>`;
  if (Math.round(data.main.temp) > 40) {
    tempp.style.color = "pink";
  } else if (
    Math.round(data.main.temp) >= 30 &&
    Math.round(data.main.temp) <= 40
  ) {
    tempp.style.color = "lightgreen";
  } else {
    tempp.style.color = "lightblue";
  }

  const type = document.querySelector(".temperature-type");
  type.innerText = `${data.weather[0].main}`;
}

const search = document.getElementById("search-helper");
const context = "To start search, click Enter";

setInterval(() => {
  search.textContent = "";
  for (let i = 0; i < context.length; i++) {
    setTimeout(() => {
      search.textContent += context[i];
    }, i * 30);
  }
}, 3000);
