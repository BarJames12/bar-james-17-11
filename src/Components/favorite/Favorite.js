import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Await, useNavigate } from "react-router-dom";
import { FaWind } from "react-icons/fa";
import { FiDroplet } from "react-icons/fi";
import { getWeatherById } from "../../Redux/actions/fetchWeather";

function Favorite() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const favoriteDetailes = JSON.parse(localStorage.getItem("favoriteLocationArr"));
  const idsArr = getIdArr(favoriteDetailes); // Array of favorites id's

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
    let idArr = favoriteDetailes.map((a) => a.id);
    return idArr;
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
    <div className="container mx-auto h-full rounded-lg backdrop-blur-md bg-white/30  min-h-[70vh] animate__animated animate__fadeIn">
      <div className="flex flex-row flex-wrap justify-evenly ">
        {idsArr.length === 0 && (
          <h1 className="font-medium leading-tight text-5xl mt-0 mb-2 text-gray-600">No Favorites</h1>
        )}

        {idsArr.length > 0 &&
          favoritesArr.map((forecast, key) => {
            return (
              <div key={key} className="flex justify-between items-center m-2">
                <>
                  <div
                    className="flex justify-center  hover:bg-white/100 , rounded-lg cursor-pointer mt-8"
                    onClick={() => onLocationClick(forecast.cityName)}
                  >
                    <div className="card min-w-sm max-w-sm transition-shadow test hover:shadow-shadow-xl w-full backdrop-blur-md bg-white/50 text-black rounded-lg">
                      <h2 className="text-md mb-2 px-4 pt-4">
                        <div className="flex justify-between">
                          <div className="badge relative top-0">
                            <span className="mt-2 py-1 h-12px text-md font-semibold w-12px  rounded right-1 bottom-1 px-4">
                              {forecast.cityName}
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
                      <div className="text-md pt-4 pb-4 px-4">
                        <div className="flex justify-between items-center">
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
                          <div>
                            <h1 className="text-6xl"> {forecast.temp}° </h1>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default Favorite;
