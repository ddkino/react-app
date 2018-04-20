/*
CREATE TABLE cha_files (
  a_id uuid,
  file_id uuid,
  cha_id timeuuid,
  name text,
  blob blob,
  datetime_created_at timestamp,
  options MAP<text, text>,
  size int,
  type text,
  PRIMARY KEY ( a_id, file_id )
); */

const typeMainGraph = `
  type File {
    a_id: ID
    file_id: ID
    name: String
    datetime_created_at: DateTime
    options: JSON
    size: Int
    type: String
    storage_filename: String
    storage_path: String
  }
`;

const typeInput = `
  input FileInput {
    name: String
    datetime_created_at: DateTime
    options: JSON
    size: Int
    type: String
    storage_filename: String
    storage_path: String
}

`;
const typeQuery = `
   type Query {
      fileByUserById(a_id: ID!, file_id: ID!, zones: [String]!): [File]
   }
`;

const typeMutation = `
  type Mutation {
      fileCreate(a_id: ID!, file_id: ID!, , zones: [String]! input: FileInput!): Boolean
  }
`;

export default [typeMainGraph, typeInput, typeQuery, typeMutation];
