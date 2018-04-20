import { makeExecutableSchema } from 'graphql-tools';
import typeDefs from './userType';
import userResolver from './userResolver';

const RootQuery = `
  type RootQuery {
    userFindById(user_id: ID!): UserPublic
  }
`;

const SchemaDefinition = `
  schema {
    query: RootQuery
  }
`;

// Put together a schema
const schema = makeExecutableSchema({
  typeDefs: [SchemaDefinition, RootQuery, ...typeDefs],
  userResolver,
});

export default schema;
