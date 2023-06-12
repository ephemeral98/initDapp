import { defineStore, storeToRefs } from 'pinia';
import { EMET_TOKEN_CONT } from '@/contracts/address';
import useCoinToken from '@/contractsApi/useCoinToken';
import { useRead } from '@/hooks/useAction';

const useTestStore = defineStore('testStore', () => {
  const emetObj = useCoinToken({
    address: EMET_TOKEN_CONT.address,
    abi: EMET_TOKEN_CONT.abi,
  });

  const [data, dataEx] = useRead(
    async () => {
      return await emetObj.getBalance();
    },
    { immediate: false, default: null }
  );

  return {
    data,
    dataEx,
  };
});

export default useTestStore;
