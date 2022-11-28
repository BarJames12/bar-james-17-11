import axios from "axios";

export function getWeather(city) {
  return async function (dispatch) {
    let apiKey = "b21fed5f0213a94f298e15abfe94994d";

    if (city) {
      await axios
        .get("https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + apiKey + "&units=metric")
        .then((response) => {
          let weatherResponse = response.data;
          let locationDetails = {
            cityName: weatherResponse.city.name,
            id: weatherResponse.city.id,
            country: weatherResponse.city.country,
            temp: weatherResponse.list[0].main.temp,
            weatherDescription: weatherResponse.list[0].weather[0].description,
            icon: "https://openweathermap.org/img/wn/" + weatherResponse.list[0].weather[0].icon + ".png",
            windSpeed: weatherResponse.list[0].wind.speed,
            isFollowed: false,
            humidity: weatherResponse.list[0].main.humidity,
            futureForecast: weatherResponse.list,
          };
          dispatch({ type: "FETCH_WEATHER", payload: locationDetails });
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
    } else {
      // Make 2 api calls because of problems with the openweathermap forecast with coord.
      let weatherRes;
      let futureWeatherRes;
      await axios
        .get("https://api.openweathermap.org/data/2.5/weather?lat=32.0833&lon=34.8&appid=" + apiKey + "&units=metric")
        .then((response) => {
          weatherRes = response.data;
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

      await axios
        .get("https://api.openweathermap.org/data/2.5/forecast?q=Tel-Aviv&appid=" + apiKey + "&units=metric")
        .then((response) => {
          futureWeatherRes = response.data;
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
      let locationDetails = {
        cityName: weatherRes.name,
        id: weatherRes.id,
        country: weatherRes.sys.country,
        temp: weatherRes.main.temp,
        weatherDescription: weatherRes.weather[0].description,
        icon: "https://openweathermap.org/img/wn/" + weatherRes.weather[0].icon + ".png",
        windSpeed: weatherRes.wind.speed,
        isFollowed: false,
        humidity: weatherRes.main.humidity,
        futureForecast: futureWeatherRes.list,
      };
      console.log(locationDetails);
      dispatch({ type: "FETCH_WEATHER", payload: locationDetails });
    }
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
