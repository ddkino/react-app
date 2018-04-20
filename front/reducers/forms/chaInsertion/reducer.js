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
const TYPE = 'CHA_INSERTION';


const CHA_INSERTION_INIT = `${TYPE}_INIT`;

const initialState = {
  security_access: "public_strict_cha",
};


const reducer = (state = initialState, action) => {
  switch (action.type) {
    case CHA_INSERTION_INIT:
      return initialState;
    default:
      return state;
  }
};

const init = () => ({
  type: 'CHA_INSERTION_INIT',
});

export default reducer;

export { init };