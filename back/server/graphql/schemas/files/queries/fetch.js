import _ from 'lodash';
import { cha_EU_DE, cha_EU_FR } from '../../../../cassandra';

/**
 * LIB
 */

export const fileByUserById = async (a_id, file_id, zones = ['EU_FR']) => {
  const zone = _.sample(zones);
  let client;
  switch (zone) {
    default:
    case 'EU_FR':
      client = cha_EU_FR;
      break;
    case 'EU_DE':
      client = cha_EU_FR;
      break;
  }
  const query = 'SELECT * FROM cha_files WHERE a_id = ? AND file_id = ? ';
  return client.execute(query, [a_id, file_id], {prepare: true});
};
