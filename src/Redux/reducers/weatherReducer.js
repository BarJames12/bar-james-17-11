const weatherInfo = (
  state = {
    weatherInfo: {},
    favoriteLocationArr: [],
    location: "",
    errorMessage: "",
    locationsInfo: [],
    favoritesArr: [{}],
  },
  action
) => {
  //Check the action type
  if (action.type === "FETCH_WEATHER") {
    state = { ...state, weatherInfo: action.payload };
  }

  // Add location to favorite and to localStorage
  if (action.type === "SAVE_LOCATION") {
    let newLocation = action.payload;
    newLocation.isFollowed = true;

    if (JSON.parse(localStorage.getItem("favoriteLocationArr")) === null) {
      state.favoriteLocationArr.push(newLocation);
      localStorage.setItem("favoriteLocationArr", JSON.stringify(state.favoriteLocationArr));
    } else {
      let localStorageArr = JSON.parse(localStorage.getItem("favoriteLocationArr"));
      state.favoriteLocationArr = localStorageArr;
      for (let i = 0; i < localStorageArr.length; i++) {
        if (state.favoriteLocationArr[i].id === newLocation.id) {
          throw new Error("cannot add new location");
        }
      }
      state.favoriteLocationArr.push(newLocation);
      localStorage.setItem("favoriteLocationArr", JSON.stringify(state.favoriteLocationArr));
    }
  }

  // Remove location from favorite
  if (action.type === "DELETE_LOCATION") {
    let locationToDelete = action.payload;
    if (JSON.parse(localStorage.getItem("favoriteLocationArr")) === null) {
      console.log("NO LOCATION ARE SAVE");
    } else {
      let localStorageArr = JSON.parse(localStorage.getItem("favoriteLocationArr"));
      state.favoriteLocationArr = localStorageArr;

      let arrAfterDeletedLocation = state.favoriteLocationArr.filter(
        (favorites) => favorites.id !== locationToDelete.id
      );
      state.favoriteLocationArr = arrAfterDeletedLocation;
      localStorage.setItem("favoriteLocationArr", JSON.stringify(arrAfterDeletedLocation));
    }
  }

  if (action.type === "CLICK_ON_LOCATION") {
    state = { ...state, location: action.payload };
  }

  if (action.type === "SEND_ERROR_MESSAGE") {
    state = { ...state, errorMessage: action.payload };
  }

  if (action.type === "FETCH_WEATHER_BY_ID") {
    state.locationsInfo.push(action.payload);
    state = { ...state, locationsInfo: state.locationsInfo };
  }
  if (action.type === "SAVE_FAVORITS_ARR") {
    state = { ...state, favoritesArr: action.payload };
  }
  return state;
};
export default weatherInfo;
