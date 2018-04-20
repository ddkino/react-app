// @flow
const TYPE = 'PROFILE';

const PROFILE_INIT = `${TYPE}_INIT`;
const PROFILE_UPDATE = `${TYPE}_UPDATE`;
const PROFILE_PENDING = `${TYPE}_PENDING`;
const PROFILE_FULFILLED = `${TYPE}_FULFILLED`;
const PROFILE_REJECTED = `${TYPE}_REJECTED`;

// reducer = modify state -> now create mapping in containers
const reducer = (state: any = {}, action: Object): any => {
  switch (action.type) {
    case PROFILE_INIT:
      return {
        ...action.data,
      };
    case PROFILE_UPDATE:
      return {
        ...state,
        ...action.data,
      };
    case PROFILE_PENDING:
      return {
        isPending: true,
      };
    case PROFILE_REJECTED:
      return {
        isRejected: true,
        error: action.payload,
      };
    case PROFILE_FULFILLED:
      return action.payload;
    default:
      return state;
  }
};

export const setProfile = (data: any) => ({
  type: PROFILE_UPDATE,
  data,
});

export const initProfile = (data: any = {isEmpty: true}) => ({
  type: PROFILE_INIT,
  data,
});

export default reducer;