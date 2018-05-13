//@flow
import mockProviders from '../../../__mocks__/providers';

import { getMongoDb } from '../../../modules/instances';

export async function Offers(): Promise<Object> {
  const db = await getMongoDb();
  return db.collection('offers');
}

const resolverMap = {
  Offer: {
    provider: async (parent: any, args: any, ctx: any) => {
      // return {
      //   id: 'p1',
      //   name: 'coca',
      //   brands: [{
      //     id: '11',
      //     name: 'cocacola',
      //     EANS: ['coca_aaaa', 'coca_bbbb']
      //   }, ],
      // }
      return mockProviders.filter(v => v.id === parent.providerId)[0];
    },
  },
};

export default resolverMap;
