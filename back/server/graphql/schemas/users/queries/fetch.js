import _ from 'lodash';
import {cha_Global} from '../../../../cassandra';
/**
 * customs lib
 */
import Crypto from '../../../../lib/bcrypt/Crypto';
import {_V, _V_Error} from '../../../../lib/commons/index';

export const byId = (user_id) => {
  const query = 'SELECT * FROM users WHERE user_id = ? ';
  return cha_Global.execute(query, [user_id], {prepare: true});
};

// todo
export const byPhone = (user_id) => {
  const query = 'SELECT * FROM users WHERE user_id = ? ';
  return cha_Global.execute(query, [user_id], {prepare: true});
};

export const byUsername = (username) => {
  const query = 'SELECT * FROM users_by_username WHERE username = ? ';
  return cha_Global.execute(query, [username], {prepare: true});
};

export const byEmail = (email) => {
  const crypto = new Crypto();
  const emailEncrypted = crypto.encrypt(email);
  const query = 'SELECT * FROM users_by_email WHERE email = ? ';
  return cha_Global.execute(query, [emailEncrypted], {prepare: true});
};

export const searchByUsername = async (username_pattern) => {
  const query = 'SELECT * FROM users_by_username LIMIT 1000';
  const result = await cha_Global.execute(query);
  const re = new RegExp(_.escapeRegExp(username_pattern), 'i');
  return result.rows.filter(v => (re.test(v.username)));
};

// todo paging todo http://datastax.github.io/nodejs-driver/features/paging/
export const searchByUsernameWithPaging = async (username_pattern) => {
  if (_V.isEmpty(username_pattern)) {
    throw new _V_Error([{key: 'USERNAME_EMPTY', message: 'The username is empty'}]);
  }
  const re = new RegExp(_.escapeRegExp(username_pattern), 'i');
  const query = 'SELECT * FROM users_by_username LIMIT 5000';

  /**
   * autopage : create paging without control
   * fetchSize = total final
   * eachRow: 2 functions : 1 for each row and 1 all rows in page
   * usually
   */
  cha_Global.eachRow(
    query, [], {
      prepare: true,
      autoPage: false,
      fetchSize: 2,
    }, (n, row) => {
      console.log(n, row);
    },
    (err, result) => {
      console.log(err, result);
      if (!err) {
        const list = result.rows.filter(v => (re.test(v.username)));
      }
    },
  );
};

