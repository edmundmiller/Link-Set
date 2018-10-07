import { GET_WEB3, GET_SETPROTOCOL } from "../actions/types";
// import isEmpty from '../utils/is-empty';

const initialState = {
  decrypted: {
    web3: {},
    setProtocol: {}
  }
};

export default function(state = initialState, action) {
  console.log("ACTION:", action.type);

  switch (action.type) {
    case GET_SETPROTOCOL:
      return {
        ...state,
        setProtocol: action.payload
      };
    case GET_WEB3:
      return {
        ...state,
        createdSetLink: action.createdSetLink,
        setAddress: action.payload
      };
    default:
      return state;
  }
}
