<script setup lang="ts">
import { useRead, useWrite } from '@/hooks/useAction';
import useCoinToken from '@contApi/useCoinToken';
import { EMET_TOKEN_CONT, STAKE_ADDR } from '@/contracts/address';
import useTestStore from '@/store/testStore';
import { bpAdd, bpMul } from 'bp-math';

console.log(bpAdd(1.366666, 2.2, { deci: -2 })); // 3.5 ? 4
const res = bpMul('1', 2, { deci: 3, fillZero: true });
console.log('res..', res);
alert(res);

const testStore = useTestStore();
const emetObj = useCoinToken({ address: EMET_TOKEN_CONT.address, abi: EMET_TOKEN_CONT.abi });

const [balan, balanEx] = useRead(
  async () => {
    const myBalan = await emetObj.getBalance();
    console.log('myBalance...', myBalan);
    return myBalan;
  },
  { default: 0 }
);

const [getDecimal, getDecimalEx] = useRead(
  async () => {
    return await emetObj.getDecimals();
  },
  { default: 18 }
);

// testStore.dataEx.doCore();

const [doAuth, loadDoAuth] = useWrite(async () => {
  await emetObj.auth(STAKE_ADDR);
});
</script>

<template>
  <div class="test-wrap">
    <h1>test wrap page...</h1>
    <div @click="doAuth">余额： {{ balan }}</div>

    <div>精度：{{ getDecimal }}</div>

    <div>
      <div>testStore::{{ testStore.data }}</div>
      <div>testStore...loading??{{ testStore.dataEx.loading }}</div>
    </div>

    <bp-button class="px-1 h-1.2" sink @click="doAuth" v-loading="loadDoAuth"
      >尝试授权write操作</bp-button
    >
  </div>
</template>

<style lang="scss" scoped>
.test-wrap {
  height: 100vh;
}
</style>
