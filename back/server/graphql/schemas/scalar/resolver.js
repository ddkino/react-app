import { GraphQLDateTime } from 'graphql-iso-date';
import GraphQLJSON from 'graphql-type-json';

const resolveFunctions = {
  DateTime: GraphQLDateTime,
  JSON: GraphQLJSON,
};

export default resolveFunctions;
