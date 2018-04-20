/**
 * Created by dd on 18/04/17.
 */
/**
 * LIB / MIDDLEWARE
 */
/**
 * All users
 * fields : user_id, username, username_alt
 */
const TYPE = 'REGISTER';


const REGISTER_RESET = `${TYPE}_RESET`;

const initialState = {};


const reducer = (state = initialState, action) => {
  switch (action.type) {
    case REGISTER_RESET:
      return {};
    default:
      return state;
  }
};

export default reducer;

export { REGISTER_RESET };