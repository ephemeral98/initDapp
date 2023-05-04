<script setup lang="ts">
import { useRead, useWrite } from '@/hooks/useAction';
import useCoinToken from '@contApi/useCoinToken';
import { EMET_TOKEN_CONT, STAKE_ADDR } from '@/contracts/address';
import useTestStore from '@/store/testStore';

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
    <h1 class="px-20 flex">test wrap page...</h1>
    <div class="text-20">20rem</div>
    <div class="text-10rem">10rem</div>
    <div class="text-10px">10px</div>
    <div class="border-r border-[#008c8c] border-3">border-right: solid 3px #008c8c;</div>
    <div class="md:(text-red text-30)">余额： {{ balan }}</div>

    <div class="md:mt-2 w-99 m-1 text-main-1">精度：{{ getDecimal }}</div>

    <div class="transform translate-y-[30rem]">
      <bp-button class="px-20 h-42" sink @click="doAuth" v-loading="loadDoAuth"
        >尝试授权write操作</bp-button
      >
    </div>
  </div>
</template>

<style lang="scss" scoped>
.test-wrap {
  height: 100vh;
}
</style>
