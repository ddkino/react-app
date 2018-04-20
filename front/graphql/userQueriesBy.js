import gql from 'graphql-tag';
import userFrag from './fragments/user';

export const USER_BY_USERNAME = gql`  
    query ($username: String!) 
    {
        userFindByUsername(username: $username) {
            ...userPublic
        }
    }
    ${userFrag.public}
`;

export const USER_BY_ID = gql`
    query ($userId: ID!)
    {
        userFindById(user_id: $userId) {
            ...userPublic
        }
    }
    ${userFrag.public}
`;

export const USER_SEARCH_BY_USERNAME = gql`
    query ($username: String!)
    {
        userSearchByUsername(username: $username) {
            ...userPublic
        }
    }
    ${userFrag.public}
`;