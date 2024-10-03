const inputValue = document.getElementById("input");
const searchButton = document.getElementById("find");

const currentDate = new Date();
const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const months = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
];

Display(); // Display initial weather info

function getDayInfo(dateOffset) {
    const date = new Date(); 
    date.setDate(currentDate.getDate() + dateOffset); 

    const day = date.getDate();
    const monthName = months[date.getMonth()];
    const dayOfWeek = daysOfWeek[date.getDay()];

    return {
        dayOfWeek: dayOfWeek,
        date: `${day} ${monthName}`
    };
}

async function fetchWeather(city) {
    try {
        const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=20d6d878b05845a7b0b215529243009&q=${city}&days=3`);
        if (!response.ok) throw new Error('Weather data not found'); 
        return await response.json();
    } catch (error) {
        console.error(error);
        alert("Failed to fetch weather data. Please check the city name.");
    }
}

async function Display(city = "cairo") {
    const weatherData = await fetchWeather(city);
    if (!weatherData) return; 
    const cityName = weatherData.location.name;
    const today = getDayInfo(0);
    const tomorrow = getDayInfo(1);
    const dayAfterTomorrow = getDayInfo(2);
    let weatherDisplay = ``;

    // Card for today
    weatherDisplay += `
        <div class="col-md-4 ">
            <div class="card bg-dark text-white">
                <div class="card-header d-flex justify-content-between">
                    <p>${today.dayOfWeek}</p>
                    <h6>${today.date}</h6>
                </div>
                <div class="card-body">
                    <h5 class="card-title py-2">${cityName}</h5>
                      <img src="https:${weatherData.forecast.forecastday[0].day.condition.icon}" alt="Weather Icon" />
                    <h1 class="card-text">${weatherData.forecast.forecastday[0].day.avgtemp_c}°C</h1>
                    <span class="text-primary">${weatherData.forecast.forecastday[0].day.condition.text}</span>
                </div>
            </div>
        </div>
    `;

    // Card for tomorrow
    weatherDisplay += `
        <div class="col-md-4">
            <div class="card  background text-white">
                <div class="card-header  text-center">
                    <p>${tomorrow.dayOfWeek}</p>
                </div>
                <div class="card-body">
                    <h1 class="card-text fs-3 pt-3">${weatherData.forecast.forecastday[1].day.maxtemp_c}°C</h1>
                    <h6 class="card-text pt-3">${weatherData.forecast.forecastday[1].day.mintemp_c}°C</h6>
                    <span class="text-primary">${weatherData.forecast.forecastday[1].day.condition.text}</span>
                <img src="https:${weatherData.forecast.forecastday[1].day.condition.icon}" alt="Weather Icon" />
                </div>
            </div>
        </div>
    `;

    // Card for the day after tomorrow
    weatherDisplay += `
        <div class="col-md-4">
            <div class="card bg-dark text-white ">
                <div class="card-header text-center">
                    <p>${dayAfterTomorrow.dayOfWeek}</p>
                </div>
                <div class="card-body">
                  <h1 class="card-text fs-3 pt-3">${weatherData.forecast.forecastday[2].day.maxtemp_c}°C</h1>
                  <h6 class="card-text  pt-3">${weatherData.forecast.forecastday[2].day.mintemp_c}°C</h6>
                    <span class="text-primary">${weatherData.forecast.forecastday[2].day.condition.text}</span>
                    <img src="https:${weatherData.forecast.forecastday[2].day.condition.icon}" alt="Weather Icon" />
                </div>
            </div>
        </div>
    `;

    document.getElementById("data").innerHTML = weatherDisplay;

    inputValue.value = ""; // Clear input after displaying data
}

//event on button find 
searchButton.addEventListener("click", async () => {
    await Display(inputValue.value);
});

// even on keyboard when click Enter
inputValue.addEventListener("keypress", async (event) => {
    if (event.key === "Enter") {
        await Display(inputValue.value);
    }
});
