import gql from 'graphql-tag';


export const FILE_BY_USER_BY_ID = gql`
    query ($a_id: ID!, $file_id: ID!, $zones: [String])
    {
        fileByUserById(a_id: $a_id, file_id: $file_id, zones: $zones) {
            a_id
            file_id
            cha_id
            name
            blob
            datetime_created_at
            options
            size
            type
            storage_filename
            storage_path
        }
    }
`;