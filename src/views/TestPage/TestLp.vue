<script setup lang="ts">
import { LP_CONT } from '@/contracts/address';
import useLpToken from '@/contractsApi/useLpToken';
import { useRead } from '@/hooks/useAction';

const lpToken = useLpToken({ address: LP_CONT.address, abi: LP_CONT.abi });

const [hasAllow, hasAllowEx] = useRead(async () => {
  return await lpToken.allow('0x6BDb16fDC24679E9dE0A4FF9aDc7A7C36831Cc21');
});

const [tokenArr, tokenArrEx] = useRead(async () => {
  return await lpToken.getTokens();
});

const [rev, revEx] = useRead(async () => {
  return await lpToken.getReserves();
});
</script>

<template>
  <div class="test-lp-wrap">
    <div i:w="[10pw] sm:3rem">LP授权了吗？？{{ hasAllow }}</div>
    <div>Token。。。Arr。。。{{ tokenArr }}</div>
    <div>Rev...Arr...{{ tokenArr }}::{{ revEx.loading }}</div>
  </div>
</template>

<style lang="scss" scoped>
.test-lp-wrap {
  div {
    margin: 0.3rem 0;
  }
}
</style>
