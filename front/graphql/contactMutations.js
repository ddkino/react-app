import gql from 'graphql-tag';


export const CONTACT_ADD = gql`
    mutation ($user_id: ID! ,$contact_ids: [ID]!) {
        userAddContacts(user_id: $user_id, contact_ids: $contact_ids) 
    }
`;

export const CONTACT_REMOVE = gql`
    mutation ($user_id: ID! ,$contact_ids: [ID]!) {
        userDeleteContacts(user_id: $user_id, contact_ids: $contact_ids) 
    }
`;
