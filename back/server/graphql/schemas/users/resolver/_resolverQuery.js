import fs from 'fs-extra';
import bcrypt from 'bcryptjs';
import cassandra from 'cassandra-driver';
import jwt from 'jsonwebtoken';
import {JwtConfig, UserConfig} from '../../../../config';
import Crypto from '../../../../lib/bcrypt/Crypto';
import {_V, _V_Error} from '../../../../lib/commons/index';

const resolverMap = {
  // ----------- models
  Query: {
    async userById(_, {user_id}, ctx) {
      const result = await ctx.models.userFetch.byId(user_id);
      return result.first();
    },
    async userFindById(_, {user_id}, ctx) {
      console.log(user_id);
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
    /**
     * USER LOGIN By<Field>
     */
    userLoginByUsername(_, {username, password}, ctx) {
      return resolverMap.Query.userLogin(_, {login: username, password, method: 'byUsername'}, ctx);
    },
    userLoginByEmail(_, {email, password}, ctx) {
      return resolverMap.Query.userLogin(_, {login: email, password, method: 'byEmail'}, ctx);
    },
    userLoginByPhone(_, {phone, password}, ctx) {
      return resolverMap.Query.userLogin(_, {login: phone, password, method: 'byPhone'}, ctx);
    },
    /**
     * USER LOGIN -> generic
     */
    async userLogin(_, {
      login, password, method,
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
        const expiresAt = JwtConfig.getExpiresdate();
        const token = jwt.sign(
          {user_id: user.user_id, role: user.role || UserConfig.role},
          JwtConfig.secret,
          {expiresIn: JwtConfig.expiresIn},
        );
        return {
          ...user,
          token,
          expiresAt,
          email: emailCrypted,
        };
      }
      throw new _V_Error([{key: 'LOGIN_PASSWORD_FAILED', message: 'password failed'}]);
    },
    /**
     * USER SEARCH BY USERNAME
     */
    userSearchByUsername(_, {username}, ctx) {
      if (_V.isEmpty(username)) {
        throw new _V_Error([{key: 'USERNAME_EMPTY', message: 'The username is empty'}]);
      }
      return ctx.models.userFetch.searchByUsername(String(username).trim());
    },
  },
};

export default resolverMap;
