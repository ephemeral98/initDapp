<script setup lang="ts">
import { bpFormat } from '@/utils/bpMath';
import { useRouteItemRef } from '@/router/useRouterTools';
import { useRead, useWrite } from '@/hooks/useAction';
import useCoinToken from '@contApi/useCoinToken';
import { EMET_TOKEN_CONT } from '@/contracts/address';
import useTestStore from '@/store/testStore';

const testStore = useTestStore();
const emetObj = useCoinToken({ address: EMET_TOKEN_CONT.address, abi: EMET_TOKEN_CONT.abi });

const [balan, balanEx] = useRead(async () => {
  const myBalan = await emetObj.getBalance();
  console.log('myBalance...', myBalan);
  return myBalan;
});

const [getDecimal, getDecimalEx] = useRead(async () => {
  return await emetObj.getDecimals();
});

testStore.dataEx.doCore();
</script>

<template>
  <div class="test-wrap">
    <h1>test wrap page...</h1>
    <div>余额： {{ balan }}</div>

    <div>精度：{{ getDecimal }}</div>

    <div>
      <div>testStore::{{ testStore.data }}</div>
      <div>testStore...loading??{{ testStore.dataEx.loading }}</div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
