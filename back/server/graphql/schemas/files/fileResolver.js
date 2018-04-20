const resolverMap = {
  Query: {
    fileByUserById(_, {a_id, file_id}, ctx) {
      return ctx.models.fileFetch.fileByUserById(a_id, file_id);
    },
  },
  Mutation: {
    fileCreate(_, {
      a_id, file_id, zones, input,
    }, ctx) {
      return ctx.models.fileWrite.create(a_id, file_id, zones, input);
    },
  },
};

export default resolverMap;
