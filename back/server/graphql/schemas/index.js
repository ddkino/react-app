import { makeExecutableSchema } from 'graphql-tools';
import allTypes from './allTypes';
import allResolvers from './allResolvers';

const schema = makeExecutableSchema({
  typeDefs: allTypes,
  resolvers: allResolvers,
});

export default schema;
