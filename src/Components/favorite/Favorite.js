import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Await, useNavigate } from "react-router-dom";
import { FaWind } from "react-icons/fa";
import { FiDroplet } from "react-icons/fi";
import { getWeatherById } from "../../Redux/actions/fetchWeather";
import { convertToF } from "../home/Home";

function Favorite() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const favoriteDetailes = JSON.parse(localStorage.getItem("favoriteLocationArr"));
  const idsArr = getIdArr(favoriteDetailes); // Array of favorites id's

  const [tempToggle, setTempToggle] = useState(true);

  const weatherDetails = useSelector((state) => state.locationsInfo); // weather details from states
  const favoritesArr = useSelector((state) => state.favoritesArr); // Array from state

  const getWeatherInfoAction = async (id) => dispatch(getWeatherById(id));

  function onLocationClick(location) {
    dispatch({ type: "CLICK_ON_LOCATION", payload: location });
    navigate(`/`);
  }

  async function getLocationsArr(idArr) {
    if (weatherDetails.length === 0) {
      for (let i = 0; i < idArr.length; i++) {
        await getWeatherInfoAction(idArr[i]);
      }
    }
  }

  function getIdArr(favoriteDetailes) {
    if (favoriteDetailes !== null) {
      let idArr = favoriteDetailes.map((a) => a.id);
      return idArr;
    }
  }

  async function organaizeInfo(idArr) {
    await getLocationsArr(idArr);
    let locationArr = weatherDetails;
    let orgenaizeArr = [];
    for (let i = 0; i < locationArr.length; i++) {
      let weatherObj = locationArr[i].weather;
      let windObj = locationArr[i].wind;
      let locationDetails = {
        cityName: locationArr[i].name,
        id: locationArr[i].id,
        country: locationArr[i].sys.country,
        temp: locationArr[i].main.temp,
        tempInF: convertToF(locationArr[i].main.temp),
        humidity: locationArr[i].main.humidity,
        icon: "https://openweathermap.org/img/wn/" + weatherObj[0].icon + ".png",
        windSpeed: windObj.speed,
      };
      orgenaizeArr.push(locationDetails);
    }

    dispatch({ type: "SAVE_FAVORITS_ARR", payload: orgenaizeArr });
  }

  useEffect(() => {
    organaizeInfo(idsArr);
    getIdArr(favoriteDetailes);
  }, []);

  return (
    <div className="container mx-auto h-full rounded-lg backdrop-blur-md bg-white/30 dark:bg-gray-500/30  min-h-[70vh] ">
      <label className="inline-flex relative items-center cursor-pointer m-3">
        <input
          type="checkbox"
          value=""
          className="sr-only peer"
          onClick={() => setTempToggle((prevCheck) => !prevCheck)}
        />

        <div className="w-11 h-6 bg-[#eab308] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
        <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300 dark:text-white">°C / °F</span>
      </label>

      <div className="flex flex-row flex-wrap justify-evenly ">
        {idsArr === undefined || idsArr.length === 0 ? (
          <h1 className="font-medium leading-tight text-5xl mt-0 mb-2 text-gray-600">No Favorites</h1>
        ) : (
          favoritesArr.map((forecast, key) => {
            return (
              <div key={key} className="flex justify-between items-center m-2 ">
                <>
                  <div
                    className="flex justify-center hover:bg-white/100 , rounded-lg border-1 border-white shadow-xl
                    cursor-pointer mt-8 animate__animated animate__fadeIn"
                    onClick={() => onLocationClick(forecast.cityName)}
                  >
                    <div className="card min-w-sm max-w-sm transition-shadow test hover:shadow-shadow-xl w-full backdrop-blur-md bg-white/50 dark:text-white dark:bg-gray-600/70 text-black rounded-lg">
                      <h2 className="text-md mb-2 px-4 pt-4">
                        <div className="flex justify-between">
                          <div className="badge relative top-0">
                            <span className="mt-2 py-1 h-12px text-md font-semibold w-12px  rounded right-1 bottom-1 px-4">
                              {forecast.cityName}
                            </span>
                            <br />
                            <span className="font-semibold mt-1 text-gray-500 dark:text-white  ml-4">
                              {forecast.country}
                            </span>
                          </div>
                        </div>
                      </h2>

                      <div className="flex items-center p-4">
                        <div className="flex justify-center items-center w-96">
                          <img
                            className="fill-current h-32 w-32"
                            alt="cloudy"
                            src={forecast.icon}
                            height="20"
                            width="20"
                          />
                        </div>
                      </div>
                      <div className="text-md pt-4 pb-4 px-4 ">
                        <div className="flex justify-between items-center ">
                          <div className="space-y-2">
                            <span className="flex space-x-2 items-center">
                              <FaWind />
                              <span>{forecast.windSpeed}km/h</span>
                            </span>
                            <span className="flex space-x-2 items-center">
                              <FiDroplet />

                              <span>{forecast.humidity}%</span>
                            </span>
                          </div>

                          {tempToggle === true ? (
                            <h1 className="text-6xl font-semibold  text-gray-800 dark:text-white">
                              {forecast.temp}
                              <span className="text-base"> C°</span>
                            </h1>
                          ) : (
                            <h1 className="text-6xl font-semibold text-gray-800 dark:text-white">
                              {forecast.tempInF}
                              <span className="text-base "> F°</span>
                            </h1>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default Favorite;
