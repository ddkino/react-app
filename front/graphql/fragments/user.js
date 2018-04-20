import gql from 'graphql-tag';

const userFragments = {
  public: gql`
      fragment userPublic on UserPublic {
          user_id
          username
          username_alt
          avatar_filename
          datetime_created_at
      }
  `,
  private: gql`
      fragment userPrivate on UserPrivate {
          user_id
          username
          username_alt
          avatar_filename
          role
          zones
          preferences
          email
          phone
          emails
          phones
#          contacts          todo
          datetime_created_at
          datetime_updated_at
          datetime_signin_at
          token
      }
  `,
};

export default userFragments;
