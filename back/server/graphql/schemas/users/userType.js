const typeMainGraph = `
type User {
  user_id: ID
  username: String
  password: String
  username_alt: String
  avatar_filename: String ## url server file
  role: String
  zones: [String]
  preferences: JSON
  email: String
  phone: String
  emails: [String]
  phones: [String]
  contacts: [UserPublic]
  datetime_created_at: DateTime
  datetime_updated_at: DateTime
  datetime_signup_at: DateTime
}

type UserPrivate {
  user_id: ID
  username: String
  username_alt: String
  avatar_filename: String ## url server file
  role: String
  zones: [String]
  preferences: JSON
  email: String
  phone: String
  emails: [String]
  phones: [String]
  contacts: [UserPublic]
  datetime_created_at: DateTime
  datetime_updated_at: DateTime
  datetime_signin_at: DateTime
  expiresAt: DateTime
  token: String ## token when login
}


type UserPublic {
  user_id: ID
  username: String
  username_alt: String
  avatar_filename: String
  datetime_created_at: DateTime
}
`;

const typeInput = `
input UserRegisterInput {
  username: String!
  password: String!
  username_alt: String
  role: String
  preferences: JSON
  email: String
  phone: String
}

input UserInput {
  password: String
  username_alt: String
  role: String
  preferences: JSON
  email: String
  phone: String
}
`;

const typeQuery = `
type Query {
  userFindByUsername(username: String!): UserPublic
  userFindById(user_id: ID!): UserPublic
  userById(user_id: ID!): UserPrivate
  userPublicById(user_id: ID!): UserPublic
  userByEmail(email: String!): UserPrivate
  userByPhone(phone: String!): UserPrivate
  userByUsername(username: String!): UserPrivate
  userLogin(login: String!, password: String!, method: String!, locale: String): UserPrivate
  userSearchByUsername(username: String!): [UserPublic]
}
`;

const typeMutation = `
type Mutation {
  userUpdatePassword(user_id: ID!, password_current: String!, password_new: String!): Boolean
  userUpdateEmail(user_id: ID!, email: String): Boolean
  userRegister(input: UserRegisterInput): UserPrivate
  userRegisterValidation(user_id: ID!): Boolean
  userUpdatePreferences(user_id: ID!, input: JSON): Boolean
  userUpdatePseudo(user_id: ID!, username_alt: String!): Boolean
  userUploadAvatar(user_id: ID!, avatar: String!): String
}
`;

export default [typeMainGraph, typeInput, typeQuery, typeMutation];
