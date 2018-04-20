import fs from 'fs';
import bcrypt from 'bcryptjs';
import cassandra from 'cassandra-driver';
import jwt from 'jsonwebtoken';
import mkdirp from 'mkdirp';
import {EnvConfig, JwtConfig, UserConfig} from '../../../config';
import Crypto from '../../../lib/bcrypt/Crypto';
import {_ as _L, _V, _V_Error} from '../../../lib/commons/index';
import {requiresAuth} from '../permissions';

const initDirUser = (user_id) => {
  const PATH = 'static/uploads';
  const dirfile = `${__dirname}/../../../../${PATH}/avatars/${user_id}`;
  mkdirp.sync(dirfile);
}

const resolverMap = {
  // ----------- typedefs
  UserPrivate: {
    contacts: async (user, args, ctx) => {
      if (_L.isEmpty(user.contacts) || _L.isNull(user.contacts)) return [];
      const all = await Promise.all(user.contacts.map(async (v) => {
        const result = await ctx.models.userFetch.byId(v);
        return result.first();
      }));
      return all;
    },
  },
  User: {
    contacts: async (user, args, ctx) => {
      if (_L.isEmpty(user.contacts) || _L.isNull(user.contacts)) return [];
      const all = await Promise.all(user.contacts.map(async (v) => {
        const result = await ctx.models.userFetch.byId(v);
        return result.first();
      }));
      return all;
    },
  },
  // ----------- models
  Query: {
    async userById(_, {user_id}, ctx) {
      const result = await ctx.models.userFetch.byId(user_id);
      return result.first();
    },
    async userFindById(_, {user_id}, ctx) {
      const result = await ctx.models.userFetch.byId(user_id);
      return result.first();
    },
    async userByEmail(_, {email}, ctx) {
      if (!_V.isEmail(email)) {
        throw new _V_Error([{key: 'EMAIL_FORMAT', message: `The email address is not valid : "${email}"`}]);
      }
      const result = await ctx.models.userFetch.byEmail(email);
      return result.first();
    },
    // todo
    async userByPhone(_, {phone}, ctx) {
      const result = await ctx.models.userFetch.byPhone(phone);
      return result.first();
    },
    // full
    async userByUsername(_, {username}, ctx) {
      if (_V.isEmpty(username)) {
        throw new _V_Error([{key: 'USERNAME_EMPTY', message: `The username is empty : "${username}"`}]);
      }
      const result = await ctx.models.userFetch.byUsername(username);
      return result.first();
    },
    // return userPublic
    async userFindByUsername(_, {username}, ctx) {
      if (_V.isEmpty(username)) {
        throw new _V_Error([{key: 'USERNAME_EMPTY', message: `The username is empty : "${username}"`}]);
      }
      const result = await ctx.models.userFetch.byUsername(username);
      return result.first();
    },
    async userLogin(_, {
      login, password, method, locale,
    }, ctx) {
      if (!login || _V.isEmpty(login)) {
        throw new _V_Error([{key: 'LOGIN_EMPTY', message: 'The login is empty'}]);
      }
      if (!password || _V.isEmpty(password)) {
        throw new _V_Error([{key: 'PASSWORD_EMPTY', message: 'The password is empty'}]);
      }
      if (_V.isPassword(password)) {
        throw new _V_Error([{key: 'PASSWORD_NOT_VALID', message: `The password is not valid: '${login}'`}]);
      }
      if (!method) {
        throw new _V_Error([{key: 'METHOD_NOT_VALID', message: `The method is not valid: '${method}'`}]);
      }
      let user;
      switch (method) {
        case 'byEmail':
          if (_V.isEmail(login)) {
            user = await resolverMap.Query.userByEmail(_, {email: login}, ctx);
            if (!user) {
              throw new _V_Error([{key: 'LOGIN_BY_EMAIL_FAILED', message: `${login}`}]);
            }
          }
          break;
        case 'byPhone':
          // todo phone
          if (_V.isMobilePhone(login, locale) >= 0) {
            user = await resolverMap.Query.userByPhone(_, {phone: login}, ctx);
            if (!user) {
              throw new _V_Error([{key: 'LOGIN_BY_PHONE_FAILED', message: `${login}`}]);
            }
          }
          break;

        case 'byUsername':
          if (_V.isUsername(login) >= 0) {
            user = await resolverMap.Query.userFindByUsername(_, {username: login}, ctx);
            if (!user) {
              throw new _V_Error([{key: 'LOGIN_BY_USERNAME_FAILED', message: `${login}`}]);
            }
          }
          break;
        default:
          throw new _V_Error([{key: 'METHOD_FAILED', message: `${method}`}]);
      }
      if (!user) {
        throw new _V_Error([{key: 'LOGIN_FAILED', message: `${login}`}]);
      }

      const testCrypt = await bcrypt.compareSync(password, user.password);
      if (testCrypt) {
        const crypto = new Crypto();
        const emailCrypted = crypto.decrypt(user.email);
        // todo preference
        const expiresAt = JwtConfig.getExpiresdate();
        const token = jwt.sign(
          {user_id: user.user_id, role: user.role || UserConfig.role},
          JwtConfig.secret,
          {expiresIn: JwtConfig.expiresIn}
        );
        // send token
        // console.log({
        //   ...user,
        //   token,
        //   expiresAt,
        //   email: crypto.decrypt(user.email),
        // });
        return {
          ...user,
          token,
          expiresAt,
          email: emailCrypted,
        };
      }
      throw new _V_Error([{key: 'LOGIN_PASSWORD_FAILED', message: 'password failed'}]);
    },
    userSearchByUsername(_, {username}, ctx) {
      if (_V.isEmpty(username)) {
        throw new _V_Error([{key: 'USERNAME_EMPTY', message: 'The username is empty'}]);
      }
      return ctx.models.userFetch.searchByUsername(String(username).trim());
    },
  },
  Mutation: {
    /** ******************************
     * AUTH REQUIRED
     ****************************** */

    /**
     * USER UPDATE PASSWORD
     */
    userUpdatePassword: requiresAuth.createResolver(async (_, {user_id, password_current, password_new}, ctx) => {
      const checkPassword = _V.isPassword(password_current);
      if (checkPassword < 0) {
        throw new _V_Error([{
          key: 'PASSWORD_FORMAT',
          message: `The password_current is not valid : "${password_current}"`,
        }]);
      }
      const checkPassword2 = _V.isPassword(password_new);
      if (checkPassword2 < 0) {
        throw new _V_Error([{key: 'PASSWORD_FORMAT', message: `The password_new is not valid : "${password_new}"`}]);
      }
      const user = await resolverMap.Query.userById(_, {user_id}, ctx);
      if (!user) {
        throw new _V_Error([{key: 'PASSWORD_USERID_NOT_AUTH', message: 'user_id failed'}]);
      }
      const testCrypt = await bcrypt.compareSync(password_current, user.password);
      if (!testCrypt) {
        throw new _V_Error([{key: 'PASSWORD_FAILED', message: 'current password failed'}]);
      }
      return ctx.models.userWrite.updatePassword(user_id, password_new);
    }),
    /**
     * USER UPDATE EMAIL
     */
    userUpdateEmail: requiresAuth.createResolver(async (parent, {user_id, email}, ctx) => {
      if (!_V.isEmail(email)) {
        throw new _V_Error([{key: 'EMAIL_FORMAT', message: `The email address is not valid : "${email}"`}]);
      }
      /**
       * search exists
       */
      const result = await ctx.models.userFetch.byEmail(email);
      if (!result) {
        throw new _V_Error([{
          key: 'EMAIL_NOT_EXISTS',
          message: `Email not exists :"${email}"`,
        }]);
      }
      return ctx.models.userWrite.updateEmail(user_id, email);
    }),
    /**
     * USER UPDATE PREFERENCES
     */
    userUpdatePreferences: requiresAuth.createResolver((parent, {user_id, input}, ctx) => ctx.models.userWrite.updatePreferences(user_id, input)),
    /**
     * USER UPDATE PSEUDO
     */
    userUpdatePseudo: requiresAuth.createResolver((parent, {user_id, username_alt}, ctx) => ctx.models.userWrite.updatePseudo(user_id, username_alt)),
    /**
     * USER UPLOAD AVATAR
     */
    userUploadAvatar: requiresAuth.createResolver((parent, {user_id, avatar}, ctx) => {
      initDirUser(user_id);
      const PATH = 'static/uploads';
      const filename = `${Date.now()}_${cassandra.types.TimeUuid.now()}.img`;
      const dirfile = `${__dirname}/../../../../${PATH}/avatars/${user_id}`;
      if (avatar) {
        fs.writeFileSync(
          `${dirfile}/${filename}`,
          avatar.replace(/^data:image\/png;base64,/, ''),
          'base64'
        );
        ctx.models.userWrite.updateAvatar(user_id, filename);
        return filename;
      } else {
        throw new _V_Error([{key: 'NO_AVATAR', message: 'no avatar'}]);
      }
    }),
    /**
     * USER REGISTER VALIDATION
     */
    userRegisterValidation(_, {user_id}, ctx) {
      return ctx.models.userWrite.registerValidation(user_id);
    },
    // userContactAddByIds (_, {user_id, contact_ids}, ctx) {
    //   return ctx.models.userWrite.contactAddByIds(user_id, contact_ids);
    // },
    // userContactRemoveByIds (_, {user_id, contact_ids}, ctx) {
    //   return ctx.models.userWrite.contactRemoveByIds(user_id, contact_ids);
    // },
    /**
     * REGISTER
     */
    async userRegister(_, {input}, ctx) {
      if (EnvConfig.env !== 'development') {
        const resultDuplication = await ctx.models.userFetch.byEmail(input.email);
        if (resultDuplication) {
          throw new _V_Error([{
            key: 'REGISTER_EMAIL_EXISTS',
            message: `Email exists :"${input.email}"`,
          }]);
        }
        /**
         * SEARCH DUPLICATION username
         */
        const resultDuplication2 = await ctx.models.userFetch.byUsername(input.username);
        if (resultDuplication2) {
          throw new _V_Error([{
            key: 'REGISTER_USERNAME_EXISTS',
            message: `Username exists :"${input.username}"`,
          }]);
        }
      }
      const user = ctx.models.userWrite.register(input);
      if (!user) {
        throw new _V_Error([{
          key: 'REGISTER_SAVE',
          message: `DB error on save on 'users' : '${input}'`,
        }]);
      }
      initDirUser(user.user_id);
      ctx.session = {...user};
      return user;
    },
  },
};

export default resolverMap;
