import { combineReducers } from "redux";
import setProtocolReducer from "./setProtocolReducer";
import apiReducer from "./apiReducer";

export default combineReducers({
	set: setProtocolReducer,
	api: apiReducer
});
