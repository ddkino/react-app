import { createSelector } from "reselect";
import logo from '../assets/logo.svg';

const contactsData = (state) => (state.contacts.data);
const contactsDataSelected = (state) => (state.contacts.selectedIds);

export const contactsSearchSelector = createSelector(
  [contactsData],
  (data) => (data.map(v => ({
    key: v.user_id,
    value: v.user_id,
    text: '@' + v.username,
    image: {avatar: true, src: v.avatar_filename || logo},
  }))),
);

export const contactsSelector = createSelector(
  [contactsData, contactsDataSelected],
  (data, selected) => {
    if (!selected || selected.length === 0) return [];
    return data.filter(d => selected.indexOf(d.user_id) >= 0) || [];
  },
);