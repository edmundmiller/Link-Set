import { GET_SET_ADDRESS } from "./types";

// getSetProtocol

// Create set
export const createSet = (
	setProtocol,
	componentAddresses,
	componentUnits,
	naturalUnit,
	name,
	symbol,
	txOpts
) => async dispatch => {
	const txHash = await setProtocol.createSetAsync(
		componentAddresses,
		componentUnits,
		naturalUnit,
		name,
		symbol,
		txOpts
	);

	const setAddress = await setProtocol.getSetAddressFromCreateTxHashAsync(
		txHash
	);

	dispatch(createSetAction(setAddress));
};

// //////////
// Actions
const createSetAction = setAddress => {
	return {
		type: GET_SET_ADDRESS,
		payload: {
			setAddress,
			createdSetLink: `https://kovan.etherscan.io/address/${setAddress}`
		}
	};
};
