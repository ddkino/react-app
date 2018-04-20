/**
 * Created by dd on 11/05/17.
 */
import { createSelector } from 'reselect';

const usersData = (state) => (state.users.data);
const usersDataSelected = (state) => (state.users.selectedIds);

export const usersSelector = createSelector(
  [usersData, usersDataSelected],
  (data, selected) => {
    if (!selected || selected.length === 0) return [];
    return data.filter(d => {
      return selected.indexOf(d.user_id) >= 0
    });
  },
);

export const usersDataSelector = createSelector(
  usersData,
  (data) => data,
);
