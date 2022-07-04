import { defineStore, storeToRefs } from 'pinia';
const useTestStore = defineStore('testStore', {
  state: () => ({
    test1: '1',
  }),

  actions: {
    setTest() {
      this.test1 = 2;
    },
  },

  getters: {},
});

export { storeToRefs, useTestStore };
