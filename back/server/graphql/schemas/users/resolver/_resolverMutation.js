import fs from 'fs-extra';
import bcrypt from 'bcryptjs';
import cassandra from 'cassandra-driver';
import jwt from 'jsonwebtoken';
import {EnvConfig, JwtConfig} from '../../../../config';
import {_V, _V_Error} from '../../../../lib/commons/index';
import {requiresAuth} from '../../permissions';

const initDirUser = (user_id) => {
  const PATH = 'static/uploads';
  const dirfile = `${__dirname}/../../../../../${PATH}/avatars/${user_id}`;
  fs.ensureDirSync(dirfile);
};


const resolverMap = {
  Mutation: {
    /********************************
     * AUTH REQUIRED
     ****************************** */
    /**
     * USER UPDATE PASSWORD
     */
    userUpdatePassword: requiresAuth.createResolver(async (_, {user_id, input: {password_current, password_new}}, ctx) => {
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
    userUpdateEmail: requiresAuth.createResolver(async (_, {user_id, input: {email}}, ctx) => {
      if (!_V.isEmail(email)) {
        throw new _V_Error([{key: 'EMAIL_FORMAT', message: `The email address is not valid : "${email}"`}]);
      }
      /**
       * search exists
       */
      const exists = await ctx.models.userFetch.byEmail(email);
      if (!exists) {
        throw new _V_Error([{
          key: 'EMAIL_NOT_EXISTS',
          message: `Email not exists :"${email}"`,
        }]);
      }
      const result = await  ctx.models.userWrite.updateEmail(user_id, email);
      if (!result) return null;
      return {email};
    }),
    /**
     * USER UPDATE PREFERENCES
     */
    userUpdatePreferences: requiresAuth.createResolver(async (_, {user_id, input: {preferences}}, ctx) => {
      const result = await ctx.models.userWrite.updatePreferences(user_id, preferences);
      if (!result) return null;
      return {preferences};
    }),
    /**
     * USER UPDATE PSEUDO
     */
    userUpdatePseudo: requiresAuth.createResolver(async (_, {user_id, input: {username_alt}}, ctx) => {
      const result = await ctx.models.userWrite.updatePseudo(user_id, username_alt);
      if (!result) return null;
      return {username_alt};
    }),
    /**
     * USER UPLOAD AVATAR
     */
    userUploadAvatar: requiresAuth.createResolver((_, {user_id, input: {avatar}}, ctx) => {
      initDirUser(user_id);
      const PATH = 'static/uploads';
      const filename = `${Date.now()}_${cassandra.types.TimeUuid.now()}.img`;
      const dirfile = `${__dirname}/../../../../${PATH}/avatars/${user_id}`;
      if (avatar) {
        try {
          fs.writeFileSync(
            `${dirfile}/${filename}`,
            avatar.replace(/^data:image\/png;base64,/, ''),
            'base64',
          );
        } catch (err) {
          return null;
        }
        ctx.models.userWrite.updateAvatar(user_id, filename);
        return filename;
      } else {
        throw new _V_Error([{key: 'NO_AVATAR', message: 'no avatar'}]);
      }
    }),
    /**
     * USER REGISTER VALIDATION
     */
    async userRegisterValidation(_, {user_id}, ctx) {
      if (ctx.models.userWrite.registerValidation(user_id)) {
        const expiresAt = JwtConfig.getExpiresdate();
        const result = await resolverMap.Query.userById(_, {user_id}, ctx);
        if (!result) return null;
        const token = jwt.sign(
          {user_id: user_id, role: result.role},
          JwtConfig.secret,
          {expiresIn: JwtConfig.expiresIn},
        );
        return {...result, token, expiresAt};
      } else {
        return null;
      }

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
      // create user_id
      input.user_id = cassandra.types.Uuid.random();
      // action register
      const user = ctx.models.userWrite.register(input);
      if (!user) {
        throw new _V_Error([{
          key: 'REGISTER_SAVE',
          message: `DB error on save on 'users' : '${input}'`,
        }]);
      }
      const expiresAt = JwtConfig.getExpiresdate();
      const result = await resolverMap.Query.userById(_, {user_id: input.user_id}, ctx);
      if (!result) return null;
      const token = jwt.sign(
        {user_id: input.user_id, role: result.role},
        JwtConfig.secret,
        {expiresIn: JwtConfig.expiresIn},
      );
      ctx.session = {...user, token, expiresAt};
      return {...result, token, expiresAt};
    },
  },
};

export default resolverMap;
