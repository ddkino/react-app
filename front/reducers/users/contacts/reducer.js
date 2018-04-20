/**
 * Created by dd on 18/04/17.
 */
import _ from 'lodash';

/**
 * All users
 * fields : user_id, username, username_alt
 */
const TYPE = 'CONTACTS';

const CONTACTS_ADD = `${TYPE}_ADD`;
const CONTACTS_PENDING = `${TYPE}_PENDING`;
const CONTACTS_FULLFILLED = `${TYPE}_FULLFILLED`;
const CONTACTS_REJECTED = `${TYPE}_REJECTED`;
const CONTACTS_TOGGLE = `${TYPE}_TOGGLE`;
const CONTACTS_TOGGLE_INIT = `${TYPE}_TOGGLE_INIT`;
const CONTACTS_LOAD = `${TYPE}_LOAD`;
const CONTACTS_INIT = `${TYPE}_INIT`;
const CONTACTS_RANDOM = `${TYPE}_RANDOM`;

const initialState = {
  isFetching: false,
  selectedIds: [],
  data: [],
};

const user = (state = {}, action) => {
  switch (action.type) {
    case CONTACTS_ADD:
      return action.data;
    default:
      return state;
  }
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case CONTACTS_LOAD:
      return {
        data: action.data,
      };
    case CONTACTS_INIT:
      return {
        data: [],
      };
    case CONTACTS_ADD:
      return {
        ...state,
        data: _.uniqBy([...action.data, ...state.data], 'user_id'),
      };
    case CONTACTS_PENDING:
      return {
        isPending: true,
      };
    case CONTACTS_REJECTED:
      return {
        isRejected: true,
        error: action.payload,
      };
    case CONTACTS_FULLFILLED:
      return {
        data: action.payload,
      };
    case CONTACTS_TOGGLE:
      if (state.selectedIds.indexOf(action.data) >= 0) {
        return {
          ...state,
          selectedIds: state.selectedIds.filter(e => e !== action.data),
        };
      }
      return {
        ...state,
        selectedIds: [...state.selectedIds, action.data],
      };
    case CONTACTS_TOGGLE_INIT:
      return {
        ...state,
        selectedIds: action.data,
      };
    case CONTACTS_RANDOM:
      return {
        ...state,
        test: String(new Date()),
      };
    default:
      return state;
  }
};

export const toggleContacts = (userId: string) => ({
  type: CONTACTS_TOGGLE,
  data: userId,
});

export const toggleInitContacts = (data: any = []) => ({
  type: CONTACTS_TOGGLE_INIT,
  data,
});

export const addContacts = (data: any) => ({
  type: CONTACTS_ADD,
  data,
});
export const setContacts = (data: any) => ({
  type: CONTACTS_LOAD,
  data,
});

export const initContacts = (data: any = []) => ({
  type: CONTACTS_INIT,
  data,
});

/**
 * to test Re-select
 * @returns {{type: string}}
 */
export const random = () => ({
  type: CONTACTS_RANDOM,
});
export default reducer;
