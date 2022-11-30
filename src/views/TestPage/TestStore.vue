<script setup lang="ts">
import { bpFormat } from '@/utils/bpMath';
import { useRouteItemRef } from '@/router/useRouterTools';
import { useRead, useWrite } from '@/hooks/useAction';
import useCoinToken from '@contApi/useCoinToken';
import { EMET_TOKEN_CONT } from '@/contracts/address';

const emetObj = useCoinToken({ address: EMET_TOKEN_CONT.address, abi: EMET_TOKEN_CONT.abi });

const [balan, balanEx] = useRead(async () => {
  return await emetObj.getBalance();
});

const [doTrans, loadDoTrans] = useWrite(async () => {
  await emetObj.transfer('0x2c1BbCDCa84Fd84C38652D75D67044711eF027ad', '100');
});
</script>

<template>
  <div class="test-wrap">
    <h1>test wrap page...</h1>
    <div>余额： {{ balan.show }}</div>
    <bp-button class="w-10 h-5 text-0.6rem" @click="doTrans" v-loading="loadDoTrans">交易</bp-button>
  </div>
</template>

<style lang="scss" scoped></style>
