import { makeExecutableSchema } from 'graphql-tools';
import typeDefs from './userType';
import resolvers from './contactResolver';

// Put together a schema
const schema = makeExecutableSchema({
  typeDefs: [...typeDefs],
  resolvers,
});

export default schema;
