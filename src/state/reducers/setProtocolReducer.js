import { GET_SET_ADDRESS } from "../actions/types";
// import isEmpty from '../utils/is-empty';

const initialState = {
  decrypted: {
    createdSetLink: "",
    setAddress: ""
  }
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_SET_ADDRESS:
      return {
        ...state,
        createdSetLink: action.payload.createdSetLink,
        setAddress: action.payload.setAddress
      };
    default:
      return state;
  }
}
