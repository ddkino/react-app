//@flow
import mockOffers from '../../../__mocks__/offers';

const resolverMap = {
  Query: {
    offers: async (
      parent: any,
      args: {
        id: string,
        userId: string,
      },
      ctx: any,
    ) => {
      console.log(ctx);
      return mockOffers;
    },
    offerById: async (
      parent: any,
      args: {
        id: string,
        userId: string,
      },
      ctx: any,
    ) => {
      const result = (await Offers()).find();
      console.log(result);
    },
  },
};

export default resolverMap;