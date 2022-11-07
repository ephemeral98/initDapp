import { defineStore, storeToRefs } from 'pinia';
import { EMET_TOKEN_CONT } from '@/contracts/address';
import CoinToken from '@/contractsApi/useCoinToken';

const useTestStore = defineStore('testStore', {
  state: () => ({
    test1: '1',
    test3: CoinToken({
      address: EMET_TOKEN_CONT.address,
      abi: EMET_TOKEN_CONT.abi,
    }),
    test4: '5565',
  }),

  actions: {
    setTest(payload) {
      this.test1 = payload;
    },

    async storeGetBalan(payload) {
      console.log('test3....', payload);
      this.test4 = 123;
    },
  },

  getters: {},
});

export default useTestStore;
