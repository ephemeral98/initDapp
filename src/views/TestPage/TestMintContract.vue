<!-- 测试质押组件 -->
<script setup lang="ts">
import { useWrite } from '@/hooks/useAction';
import useMintContractApi from '@contApi/useMintContractApi';

const { mint } = useMintContractApi();

const [handleMint, loadMint] = useWrite(async () => {
  await mint('0.01');
});
</script>

<template>
  <div class="test-mint-wrap">
    <BpButton @click="handleMint" v-loading="loadMint">mint</BpButton>
  </div>
</template>

<style lang="scss" scoped></style>
