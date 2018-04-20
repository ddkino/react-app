import jwt from 'jsonwebtoken';
import moment from 'moment';
import cassandra from 'cassandra-driver';
import {cha_Global} from '../../../../cassandra';
import {DbEventError, DbEventSuccess} from '../../../../lib/events';
/**
 * LIB
 */
import {EnvConfig, JwtConfig, UserConfig} from '../../../../config';
import {encrypt} from '../../../../lib/bcrypt/bcrypt';
import Crypto from '../../../../lib/bcrypt/Crypto';

export const updatePassword = async (user_id, password) => {
  const passwordEncrypted = await encrypt(password);
  const values = {
    password: passwordEncrypted,
    datetime_updated_at: moment.utc().toDate(),
  };
  try {
    const query = `UPDATE users SET ${Object.keys(values).map(k => `${k}=?`).join(',')} WHERE user_id = ?`;
    const tmp = Object.values(values);
    tmp.push(user_id);
    cha_Global.execute(query, tmp, {prepare: true});
    DbEventSuccess.emit('USER_UPDATE_PASSWORD', null, password);
    return true;
  } catch (err) {
    DbEventError.emit('USER_UPDATE_PASSWORD', err, password);
    return false;
  }
};

export const updateAvatar = async (user_id, avatar) => {
  const values = {
    avatar_filename: avatar,
    datetime_updated_at: moment.utc().toDate(),
  };
  try {
    const query = `UPDATE users SET ${Object.keys(values).map(k => `${k}=?`).join(',')} WHERE user_id = ?`;
    const tmp = Object.values(values);
    tmp.push(user_id);
    cha_Global.execute(query, tmp, {prepare: true});
    DbEventSuccess.emit('USER_UPDATE_AVATAR', null, null);
    return true;
  } catch (err) {
    DbEventError.emit('USER_UPDATE_AVATAR', err, null);
    return false;
  }
};

export const updatePreferences = async (user_id, input) => {
  const {zones, language, country, timezone} = input;
  const values = {
    zones: zones ? [zones] : UserConfig.zones,
    preferences: {
      language: language || UserConfig.language,
      country: country || UserConfig.country,
      timezone: timezone || UserConfig.timezone
    },
    datetime_updated_at: moment.utc().toDate(),
  };
  try {
    const query = `UPDATE users SET ${Object.keys(values).map(k => `${k}=?`).join(',')} WHERE user_id = ?`;
    const tmp = Object.values(values);
    tmp.push(user_id);
    cha_Global.execute(query, tmp, {prepare: true});
    DbEventSuccess.emit('USER_UPDATE_PREFERENCES', null, input);
    return true;
  } catch (err) {
    DbEventError.emit('USER_UPDATE_PREFERENCES', err, input);
    return false;
  }
};

export const updateEmail = async (user_id, email) => {
  const crypto = new Crypto();
  const emailEncrypted = crypto.encrypt(email);
  const values = {
    email: emailEncrypted,
    datetime_updated_at: moment.utc().toDate(),
  };
  try {
    const query = `UPDATE users SET ${Object.keys(values).map(k => `${k}=?`).join(',')} WHERE user_id = ?`;
    const tmp = Object.values(values);
    tmp.push(user_id);
    cha_Global.execute(query, tmp, {prepare: true});
    DbEventSuccess.emit('USER_UPDATE_EMAIL', null, email);
    return true;
  } catch (err) {
    DbEventError.emit('USER_UPDATE_EMAIL', err, email);
    return false;
  }
};

export const updatePseudo = async (user_id, username_alt) => {
  const values = {
    username_alt,
    datetime_updated_at: moment.utc().toDate(),
  };
  try {
    const query = `UPDATE users SET ${Object.keys(values).map(k => `${k}=?`).join(',')} WHERE user_id = ?`;
    const tmp = Object.values(values);
    tmp.push(user_id);
    cha_Global.execute(query, tmp, {prepare: true});
    DbEventSuccess.emit('USER_UPDATE_PSEUDO', null, username_alt);
    return true;
  } catch (err) {
    DbEventError.emit('USER_UPDATE_PSEUDO', err, username_alt);
    return false;
  }
};

export const register = async (input, withEmail = true) => {
  const passwordEncrypted = await encrypt(input.password);
  const crypto = new Crypto();
  const emailEncrypted = crypto.encrypt(input.email);
  const user_id = cassandra.types.Uuid.random();
  const token = jwt.sign(
    {user_id, role: UserConfig.role},
    JwtConfig.secret,
    {expiresIn: JwtConfig.expiresIn}
  );

  /**
   * init if not exists zones &  preferences
   */
  const userData = Object.assign(
    {},
    {
      zones: UserConfig.zones,
      preferences: {
        language: UserConfig.language, country: UserConfig.country,
      },
      role: UserConfig.role,
    },
    input, {
      user_id,
      email: emailEncrypted,
      password: passwordEncrypted,
      datetime_created_at: moment.utc().toDate(),
    },
  );

  const query = `INSERT INTO users (${Object.keys(userData)}) VALUES (${new Array(Object.keys(userData).length).fill('?')})`;
  const result = await cha_Global.execute(query, Object.values(userData), {prepare: true});
  if (result) {
    const expiresAt = JwtConfig.getExpiresdate();
    /**
     * send mail by nats
     */
    if (withEmail) {
      const ttl = moment().add('1', 'd').unix();
      const tokenRegister = crypto.sha256(JwtConfig.secret + user_id);
      const dataEmail = {
        from: EnvConfig.emailFrom,
        email: input.email,
        username: input.username,
        // todo url validation
        url: `http://${EnvConfig.hostname}:${EnvConfig.port}/user.register?user_id=${user_id}&token=${tokenRegister}&ttl=${ttl}`, // todo
      };
      DbEventSuccess.emit('USER_REGISTER_WITH_EMAIL', null, dataEmail);
    }

    DbEventSuccess.emit('USER_REGISTER', null, userData);
    return {
      ...userData,
      token,
      expiresAt,
      email: crypto.decrypt(userData.email),
    };
  }
  DbEventError.emit('USER_REGISTER', result, userData);
  return null;
};

export const registerValidation = async (user_id) => {
  const datetime_signup_at = moment.utc().toDate();
  try {
    const query = 'UPDATE users SET datetime_signup_at = datetime_signup_at WHERE user_id = ? ';
    await cha_Global.execute(query, [datetime_signup_at, user_id], {prepare: true});
    DbEventSuccess.emit('USER_REGISTER_VALIDATION', null, user_id);
    return true;
  } catch (err) {
    DbEventError.emit('USER_REGISTER_VALIDATION', err, user_id);
    return false;
  }
};

/**
 * todo -> close account ? 
 * not exposed to resolvers
 */
export const deleteUser = async (user_id) => {
  try {
    const deleteByid = 'DELETE FROM users WHERE user_id = ?';
    await cha_Global.execute(deleteByid, [user_id], {prepare: true});
    DbEventSuccess.emit('ADMIN_USER_DELETE', null, user_id);
    return true;
  } catch (err) {
    DbEventError.emit('ADMIN_USER_DELETE', err, user_id);
    return false;
  }
};

//* **********************************
// for users+contacts actions goto contacts queries
//* **********************************
