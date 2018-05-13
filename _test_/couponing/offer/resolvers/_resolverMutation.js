//@flow
import { getMongoDb } from '../../../modules/instances';

export async function Offers(): Promise<Object> {
  const db = await getMongoDb();
  return db.collection('offers');
}

const resolverMap = {
  Mutation: {
    offerCreate: async (parent: any, input: any, ctx: any) => {
      const result = (await Offers()).find();
      console.log(result);
    },
  },
};

export default resolverMap;
