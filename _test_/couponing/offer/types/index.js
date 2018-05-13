import path from 'path';
import { fileLoader } from 'merge-graphql-schemas';
import { EAN, DateTime } from '../../../nodes/common/index';
const typesArray = fileLoader(path.join(__dirname, './_*.graphqls'));

export default typesArray.join('') + EAN + DateTime;
