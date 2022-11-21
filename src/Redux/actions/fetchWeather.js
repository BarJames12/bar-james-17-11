import axios from "axios";

export function getWeather(city) {
  return async function (dispatch) {
    let apiKey = "6320216d18cfa5f8622027a45b078999";
    await axios
      .get("https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + apiKey + "&units=metric")

      .then((response) => {
        let weatherResponse = response.data;
        dispatch({ type: "FETCH_WEATHER", payload: weatherResponse });
       
      })
      .catch((err) => {
        if (err.response.status === 404) {
          const error = new Error("Location does not exist");
          error.status = 404;
          throw error;
        } else {
          const error = new Error("Server problems try Again later");

          throw error;
        }
      });
  };
}
export function getWeatherById(id) {
  return async function (dispatch) {
    let apiKey = "6320216d18cfa5f8622027a45b078999";
    await axios
      .get("https://api.openweathermap.org/data/2.5/weather?id=" + id + "&appid=" + apiKey + "&units=metric")
      .then((response) => {
        let weatherResponse = response.data;
        dispatch({ type: "FETCH_WEATHER_BY_ID", payload: weatherResponse });
        console.log(weatherResponse);
      })
      .catch((err) => {
        if (err.response.status === 404) {
          const error = new Error("Location does not exist");
          error.status = 404;
          throw error;
        } else {
          const error = new Error("Server problems try Again later");
          throw error;
        }
      });
  };
}
