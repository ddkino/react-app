import { cha_Global } from '../../../../cassandra';


export const userAddContacts = async (user_id, contact_ids) => {
  let result = false;
  try {
    const query = 'UPDATE users SET contacts = contacts + ? WHERE user_id = ? ';
    await cha_Global.execute(query, [contact_ids, user_id], {prepare: true});
    result = true;
  } catch (err) {
    result = false;
  }
  return result;
};

export const userDeleletContacts = async (user_id, contact_ids) => {
  let result = false;
  try {
    const query = 'UPDATE users SET contacts = contacts - ? WHERE user_id = ? ';
    await cha_Global.execute(query, [contact_ids, user_id], {prepare: true});
    result = true;
  } catch (err) {
    result = false;
  }
  return result;
};
