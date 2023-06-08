<script setup lang="ts">
import { useRead, useWrite } from '@/hooks/useAction';
import useCoinToken from '@contApi/useCoinToken';
import { EMET_TOKEN_CONT, STAKE_ADDR } from '@/contracts/address';

const emetObj = useCoinToken({ address: EMET_TOKEN_CONT.address, abi: EMET_TOKEN_CONT.abi });

const [balan, balanEx] = useRead(
  async () => {
    const myBalan = await emetObj.getBalance();
    console.log('myBalance...', myBalan);
    return myBalan;
  },
  { default: { origin: '0', show: '0' } }
);

const [getDecimal, getDecimalEx] = useRead(
  async () => {
    return await emetObj.getDecimals();
  },
  { default: 18 }
);

const [doAuth, loadDoAuth] = useWrite(async () => {
  await emetObj.auth(STAKE_ADDR);
});
</script>

<template>
  <div class="test-wrap">
    <h1>test wrap page...</h1>
    <div @click="doAuth">余额： {{ balan }}</div>

    <div>精度：{{ getDecimal }}</div>

    <bp-button class="px-20" sink @click="doAuth" v-load="loadDoAuth">尝试授权write操作</bp-button>
  </div>
</template>

<style lang="scss" scoped>
.test-wrap {
  height: 100vh;
}
</style>
