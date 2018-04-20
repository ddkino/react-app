import {cha_EU_DE, cha_EU_FR, cha_US_WE} from '../../../../cassandra';
import {DbEventSuccess} from '../../../../lib/events';

// see router classic
export const create = async (a_id, file_id, zones, input) => {
  const valuesFile = Object.assign({}, {a_id, file_id}, input);
  const query = `INSERT INTO cha_files (${Object.keys(valuesFile)}) VALUES (${new Array(Object.keys(valuesFile).length).fill('?')})`;

  try {
    if (zones.indexOf('EU_FR') >= 0) cha_EU_FR.execute(query, Object.values(valuesFile), {prepare: true});
    if (zones.indexOf('EU_DE') >= 0) cha_EU_DE.execute(query, Object.values(valuesFile), {prepare: true});
    if (zones.indexOf('US_WE') >= 0) cha_US_WE.execute(query, Object.values(valuesFile), {prepare: true});
    DbEventSuccess.emit('FILE_UPLOAD', null, {
      a_id, file_id, zones, input,
    });
    return true;
  } catch (err) {
    DbEventSuccess.emit('FILE_UPLOAD', err, {
      a_id, file_id, zones, input,
    });
    return false;
  }
};
