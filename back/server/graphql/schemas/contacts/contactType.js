const typeMainGraph = `
type ContactGroup {
  a_id: ID!
  group_id: ID!
  group_name: String
  users: [UserPublic]
  datetime_created_at: DateTime
  datetime_updated_at: DateTime
  datetime_opened_at: DateTime
}
`;


const typeElementsGraph = `

`;

const typeQuery = `
type Query {
  contactByGroupId(group_id: ID): ContactGroup
  contactByUser(a_id: ID): ContactGroup
}
`;

const typeMutation = `
type Mutation {
  userAddContacts(user_id: ID!, contact_ids: [ID]!): Boolean
  userDeleteContacts(user_id: ID!, contact_ids: [ID]!): Boolean
}
`;

export default [typeMainGraph, typeElementsGraph, typeQuery, typeMutation];
