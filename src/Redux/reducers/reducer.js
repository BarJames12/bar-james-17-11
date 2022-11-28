import { combineReducers } from "redux";
import { weatherInfo, location, errorMessage , locationsInfo, favoritesArr  } from "./weatherReducer";

//combine reducers
const reducers = combineReducers({
  weatherInfo: weatherInfo,
  location: location,
  errorMessage: errorMessage,
  locationsInfo: locationsInfo,
  favoritesArr: favoritesArr,
});

export default reducers;
