<script setup lang="ts">
import { useRead, useWrite } from '@/hooks/useAction';
import useLpToken from '@contApi/useLpToken';
import { LP_CONT, STAKE_ADDR } from '@/contracts/address';
import { ethers } from 'ethers';

const lpObj = useLpToken({ address: LP_CONT.address, abi: LP_CONT.abi });

const [balan, balanEx] = useRead(
  async () => {
    const myBalan = await lpObj.getBalance();

    return myBalan;
  },
  { default: { origin: '0', show: '0' } }
);

const [getTokenReserves, getTokenReservesEx] = useRead(
  async () => {
    const res = await lpObj.getTokenReserves('0x496d66a9f36c04cca4a9bd4352c1ca6e7bc4ccf3', '0x7181270023030fcfe34b3a21eec16855aa169f83');
    console.log('res...', res);
    
  },
  { default: null }
);

const [doAuth, loadDoAuth] = useWrite(async () => {
  await lpObj.auth(STAKE_ADDR);
});
</script>

<template>
  <div class="test-wrap">
    <h1>test wrap page...</h1>
    <div >余额： {{ balan.origin }}</div>


    <bp-button class="px-20" sink @click="doAuth" v-load="loadDoAuth">尝试授权write操作</bp-button>
  </div>
</template>

<style lang="scss" scoped>
.test-wrap {
  height: 100vh;
}
</style>
