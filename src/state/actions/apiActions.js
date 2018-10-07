import { GET_SETPROTOCOL, GET_WEB3 } from "./types";

// Create set
export const dispatchGetWeb3 = injectedWeb3 => dispatch => {
	console.log("DISPATCHING WEB3");
	dispatch({
		type: GET_WEB3,
		payload: {
			web3: injectedWeb3
		}
	});
};

// Create set
export const dispatchSetProtocol = setProtocol => dispatch => {
	console.log("DISPATCHING SET");
	dispatch({
		type: GET_SETPROTOCOL,
		payload: {
			setProtocol
		}
	});
};
