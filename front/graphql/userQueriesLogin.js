import gql from 'graphql-tag';
import userFrag from './fragments/user';

export const USER_LOGIN = gql`
    query ($login: String!, $password: String!, $method: String!, $locale: String)
    {
        userLogin(login: $login, password: $password, method: $method, locale: $locale) {
            ...userPrivate
            contacts {
                ...userPublic
            }
        }
    }
    ${userFrag.private}
    ${userFrag.public}
`;