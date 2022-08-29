<script setup lang="ts">
import { EMET_TOKEN_CONT, NFT_CONT } from '@/contracts/address';
import CoinToken from '@/contractsApi/useCoinToken';
import { useRead, watchAccount } from '@/hooks/useAction';
import useTestStore from '@/store/testStore';
import { useAppStore } from '@/store/appStore';

import useNftToken from '@/contractsApi/useNftToken';

const { isApprovedForAll } = useNftToken({ address: NFT_CONT.address, abi: NFT_CONT.abi });

const [hasAllow, hasAllowEx] = useRead(async () => {
  return await isApprovedForAll('0x3E65e4dAcc86C7A3b053F9c6B2faee1A11F5037F');
});

watchEffect(() => {
  console.log('hasAllow', hasAllow);
  console.log('hasAllow.value...', hasAllow.value);
  console.log('hasAllow.value...', hasAllow.value.value);
});
</script>

<template>
  <div>
    <h1>this is test store...</h1>
    aaa{{ hasAllow }}
  </div>
</template>

<style lang="scss" scoped></style>
