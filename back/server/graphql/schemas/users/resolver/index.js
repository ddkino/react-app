import path from 'path';
import {mergeResolvers, fileLoader} from 'merge-graphql-schemas';

const typesArray = fileLoader(path.join(__dirname, './_*.js'));

export default mergeResolvers(typesArray);
