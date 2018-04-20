export const resolverMap = {
  // ----------- models
  Query: {
    // contactByGroupId(_, {
    //   user_id,
    // }) {
    //   // return fetch.contacts(user_id);
    // },
    // contactByUser(_, {
    //   user_id,
    // }) {
    //   // return fetch.contacts(user_id);
    // },
  },
  Mutation: {
    userAddContacts(_, {user_id, contact_ids}, ctx) {
      // filter owner
      const contactIdsFilter = contact_ids.filter(v => v !== user_id);
      return ctx.models.contactWrite.userAddContacts(user_id, contactIdsFilter)
    },
    userDeleteContacts(_, {user_id, contact_ids}, ctx) {
      return ctx.models.contactWrite.userDeleletContacts(user_id, contact_ids)
    },
  },
};

export default resolverMap;
