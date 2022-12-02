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
</script>

<template>
  <div class="test-wrap">
    <h1>test wrap page...</h1>
    <div>余额： {{ balan.show }}</div>
  </div>
</template>

<style lang="scss" scoped></style>
