import React, { useEffect, useState } from "react";
import { MagnifyingGlassCircleIcon } from "@heroicons/react/24/outline";
import { useSelector, useDispatch } from "react-redux";
import { BsStarFill, BsStar } from "react-icons/bs";
import { FiDroplet } from "react-icons/fi";
import "animate.css";

//action
import { getWeather } from "../../Redux/actions/fetchWeather";
import axios from "axios";
import SearchBar from "../searchBar/SearchBar";

export function convertToF(celsius) {
  // make the given fahrenheit variable equal the given celsius value
  // multiply the given celsius value by 9/5 then add 32
  let fahrenheit = (celsius * 9) / 5 + 32;

  // return the variable fahrenheit as the answer
  return fahrenheit.toFixed(1);
}

function Home() {
  // set city
  const [city, setCity] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const dispatch = useDispatch();

  const [tempToggle, setTempToggle] = useState(true);

  const getWeatherInfoAction = async (city) => dispatch(getWeather(city)); // Send search input to forecast api and send to state (4 days)
  const weatherDetails = useSelector((state) => state); // Details for current weather from state
  const locationDetails = checkIfLocationIsFav(weatherDetails); // Getting details from
  const futureForecast = getFutureForecast(weatherDetails); // Getting the future forecast details (No api)
  const clickedLocation = useSelector((state) => state.location); // Send favorite to state

  function checkIfLocationIsFav(weatherDetails) {
    let locationDetails = weatherDetails.weatherInfo;
    const favoriteDetailes = JSON.parse(localStorage.getItem("favoriteLocationArr"));
    if (favoriteDetailes !== null) {
      for (let i = 0; i < favoriteDetailes.length; i++) {
        if (favoriteDetailes[i].id === weatherDetails.weatherInfo.id) {
          weatherDetails.weatherInfo.isFollowed = true;
        }
      }
    }
    return locationDetails;
  }

  const getAutoComplete = (e) => {
    e.preventDefault(e);
    axios.get(
      `http://dataservice.accuweather.com/locations/v1/cities/autocomplete?apikey=pT7l1A36BoK7dSIoYkHs1sEOA9XJ2Gs1&q=${city}`.then(
        (response) => {
          console.log(response.data);
        }
      )
    );
  };

  function getFutureForecast(weatherDetails) {
    let weatherInfo = weatherDetails.weatherInfo.futureForecast;
    if (weatherInfo !== undefined) {
      let forecastObj = [];
      for (let i = 8; i < weatherInfo.length; i += 8) {
        let tempObj = {
          date: weatherInfo[i].dt,
          description: weatherInfo[i].weather[0],
          humidity: weatherInfo[i].main.humidity,
          icon: "https://openweathermap.org/img/wn/" + weatherInfo[i].weather[0].icon + ".png",
          minTemp: weatherInfo[i].main.temp_min,
          maxTemp: weatherInfo[i].main.temp_max,
          maxTempOnF: convertToF(weatherInfo[i].main.temp_max),
          minTempOnF: convertToF(weatherInfo[i].main.temp_min),
        };
        tempObj.date = timeConverter(tempObj.date);

        forecastObj.push(tempObj);
      }

      return forecastObj;
    }
  }

  function onFollowClick(locationDetails) {
    if (locationDetails.isFollowed === false) {
      dispatch({ type: "SAVE_LOCATION", payload: locationDetails });

      getWeatherInfoAction(locationDetails.cityName);
    } else {
      dispatch({ type: "DELETE_LOCATION", payload: locationDetails });
      getWeatherInfoAction(locationDetails.cityName);
    }
  }

  const handleOnSearchChange = (searchData) => {
    console.log(searchData);
  };

  useEffect(() => {
    if (clickedLocation === "") {
      getWeatherInfoAction();
    } else {
      getWeatherInfoAction(clickedLocation);
    }
  }, []);

  function timeConverter(UNIX_timestamp) {
    let a = new Date(UNIX_timestamp * 1000);
    let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let year = a.getFullYear();
    let month = months[a.getMonth()];
    let date = a.getDate();

    let time = date + " " + month + " " + year + " ";
    return time;
  }

  const onSearchClick = async (e) => {
    e.preventDefault();

    if (city === "") {
      setErrorMsg("Pick Location");
    } else {
      try {
        await getWeatherInfoAction(city);
        setErrorMsg("");
      } catch (e) {
        setErrorMsg(e.message);
      }
    }
  };

  return (
    <div>
      {/* <SearchBar onSearchChange={handleOnSearchChange} /> */}
      <div className="flex justify-center mt-8 ">
        <form className="flex flex-col items-center" onSubmit={onSearchClick}>
          <div className="input flex">
            <input
              className="w-25 md:w-96 shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              placeholder="Search City"
              onChange={(e) => setCity(e.target.value)}
            />
            <button type="submit" value="Check Weather">
              <MagnifyingGlassCircleIcon className="w-10  " />
            </button>
          </div>
          <div className="error-msg text-red-600">
            <span>{errorMsg}</span>
          </div>
        </form>
      </div>
      <div
        className="container mt-4 mx-auto h-full rounded-lg  backdrop-blur-md bg-white/30 dark:bg-gray-500/30 min-h-[70vh] animate__animated
        animate__fadeIn "
      >
        <label className="inline-flex relative items-center cursor-pointer m-3">
          <input
            type="checkbox"
            value=""
            className="sr-only peer"
            onClick={() => setTempToggle((prevCheck) => !prevCheck)}
          />

          <div className="w-11 h-6 bg-[#eab308] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          <span className="ml-3 text-sm font-medium text-gray-900 dark:text-white">°C / °F</span>
        </label>
        <div className="details flex flex-col mt-10 ">
          <br />
          {locationDetails === undefined ? (
            <h1 className="font-medium leading-tight text-5xl mt-0 mb-2 text-gray-600">
              No data to show, Please try again later
            </h1>
          ) : (
            <div>
              <div className="flex flex-col items-center justify-center text-gray-700 dark:text-white p-10 ">
                <div className="w-full max-w-screen-sm bg-white dark:bg-gray-600 p-6 sm:p-10 rounded-xl ring-8 ring-white ring-opacity-40">
                  <div className="flex justify-between items-center	">
                    <div className="flex flex-col ">
                      <div className=" ">
                        {locationDetails.isFollowed && (
                          <>
                            <BsStarFill
                              className="w-8 h-8 lg:w-10 lg:h-10 text-red-600 cursor-pointer"
                              onClick={() => onFollowClick(locationDetails)}
                            />
                          </>
                        )}
                        {!locationDetails.isFollowed && (
                          <>
                            <BsStar
                              className=" w-8 h-8 lg:w-10 lg:h-10 text-red-600 cursor-pointer"
                              onClick={() => onFollowClick(locationDetails)}
                            />
                          </>
                        )}
                      </div>
                      {tempToggle ? (
                        <span className=" sm:text-6xl font-bold">{locationDetails.temp}°C</span>
                      ) : (
                        <span className=" sm:text-6xl font-bold">{convertToF(locationDetails.temp)}°F</span>
                      )}

                      <span className="font-semibold mt-1 text-gray-500 dark:text-white">
                        {locationDetails.cityName + " " + locationDetails.country}
                      </span>
                    </div>
                    <img
                      className="md:h-20 md:w-24 md:block hidden fill-current "
                      alt="cloudy"
                      src={locationDetails.icon}
                      width="50"
                    />
                  </div>
                </div>

                <div className="flex flex-col space-y-6 w-full max-w-screen-sm bg-white p-[10px] mt-10 rounded-xl ring-8 ring-white ring-opacity-40 dark:text-white dark:bg-gray-600">
                  <>
                    {futureForecast === undefined ? (
                      <p>No data!</p>
                    ) : (
                      futureForecast.map((forecast, key) => {
                        return (
                          <div key={key} className="flex justify-between md:text-lg  md:font-semibold items-center">
                            <>
                              <span className=" text-lg ">{forecast.date}</span>
                              <div className="flex items-center justify-start md:justify-end w-1/4 pr-10">
                                <span className=" ">{forecast.humidity}%</span>
                                <span className="">
                                  <FiDroplet />
                                </span>
                              </div>
                              <img className="h-8 w-8 md:block hidden fill-current " alt="cloudy" src={forecast.icon} />
                              {tempToggle && (
                                <span className="text-right w-[8rem]">
                                  {forecast.minTemp}° / {forecast.maxTemp}°
                                </span>
                              )}
                              {!tempToggle && (
                                <span className="text-right">
                                  {forecast.minTempOnF}° / {forecast.maxTempOnF}°
                                </span>
                              )}
                            </>
                          </div>
                        );
                      })
                    )}
                  </>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
