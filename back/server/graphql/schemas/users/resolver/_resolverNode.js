import {_L} from '../../../../lib/commons/index';

const resolverMap = {
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
};

export default resolverMap;
