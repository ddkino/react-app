import gql from 'graphql-tag';
import userFrag from './fragments/user';

export const USER_REGISTER = gql`
    ${userFrag.private}
    ${userFrag.public}
    mutation ($username: String! ,$password: String!,$email: String!) {
        userRegister(input: {username: $username, password: $password, email: $email}) {
            ...userPrivate
            contacts {
                ...userPublic
            }
        }
    }
`;

export const USER_UPDATE_PASSWORD = gql`
    mutation ($user_id: ID! ,$password_current: String!,$password_new: String!) {
        userUpdatePassword(user_id: $user_id, password_current: $password_current, password_new: $password_new)
    }
`;

export const USER_UPLOAD_AVATAR = gql`
    mutation ($user_id: ID! ,$avatar: String!) {
        userUploadAvatar(user_id: $user_id, avatar: $avatar)
    }
`;

export const USER_UPDATE_PREFERENCES = gql`
    mutation ($user_id: ID! ,$input: JSON) {
        userUpdatePreferences(user_id: $user_id, input: $input)
    }
`;

export const USER_UPDATE_PSEUDO = gql`
    mutation ($user_id: ID! ,$username_alt: String!) {
        userUpdatePseudo(user_id: $user_id, username_alt: $username_alt)
    }
`;
