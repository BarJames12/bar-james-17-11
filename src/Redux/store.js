import thunk from "redux-thunk";
import { createStore, applyMiddleware } from "redux";

import reducers from "./reducers/weatherReducer";

const middleware = applyMiddleware(thunk);

const store = createStore(reducers, middleware);
export default store;
