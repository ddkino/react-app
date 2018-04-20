// @flow
import _ from 'lodash';

const TYPE = 'USERS';

const USERS_ADD = `${TYPE}_ADD`;
const USERS_SET = `${TYPE}_SET`;
const USERS_INIT = `${TYPE}_INIT`;
const USERS_TOGGLE = `${TYPE}_TOGGLE`;
const USERS_RANDOM = `${TYPE}_RANDOM`;
const USERS_TOGGLE_INIT = `${TYPE}_TOGGLE_INIT`;
const initialState = {
  isLoading: false,
  selectedIds: [],
  data: [],
};

const reducer = (state: any = initialState, action: Object): any => {
  switch (action.type) {
    case USERS_RANDOM:
      return {
        ...state,
        test: String(new Date()),
      };
    case USERS_ADD:
      return {
        isFullfilled: true,
        data: _.uniqBy([...state.data, ...action.data], 'user_id'),
      };
    case USERS_SET:
      return {
        isFullfilled: true,
        data: action.data,
      };
    case USERS_INIT:
      return initialState;
    case USERS_TOGGLE:
      if (state.selectedIds.indexOf(action.data) >= 0) {
        return {
          ...state,
          selectedIds: state.selectedIds.filter(e => e !== action.data),
        };
      }
      return {
        ...state,
        selectedIds: _.uniqBy([...state.selectedIds, action.data], 'user_id'),
      };
    case USERS_TOGGLE_INIT:
      return {
        ...state,
        selectedIds: action.data,
      };
    default:
      return state;
  }
};

export const addUsers = (data: any) => ({
  type: USERS_ADD,
  data,
});

export const setUsers = (data: any) => ({
  type: USERS_SET,
  data,
});

export const initUsers = () => ({
  type: USERS_INIT,
});
/**
 * IMPORTANT Toggle ONE element
 * @param userId
 * @returns {{type: string, data: string}}
 */
export const toggleUsers = (userId: string) => ({
  type: USERS_TOGGLE,
  data: userId,
});

export const toggleInitUsers = (data: Array<string> = []) => ({
  type: USERS_TOGGLE_INIT,
  data,
});

export const random = () => ({
  type: USERS_RANDOM,
});

export default reducer;

