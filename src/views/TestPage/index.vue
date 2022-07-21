<script setup lang="ts">
import { LP_MINT_CONT } from '@/contracts/address';
import { useRead, useWrite, useLayRead } from '@hooks/useAction';
import LpToken from '@/contractsApi/LpToken';
import { useTestStore } from '@store/testStore';
import { watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import MintContractApi from '@/contractsApi/MintContractApi';
const lpObj = new LpToken(LP_MINT_CONT);
const mintCont = new MintContractApi();

const testStore = useTestStore();

const [checkInfo, { datas: myBalan, loading }] = useRead(async () => {
  const p1 = lpObj.getTokens();
  const p2 = lpObj.getTokens();
  const p3 = lpObj.getTokens();

  const result = await Promise.all([p1, p2, p3]);
  console.log('result...', result);
  return result;
});

const [data, ex] = useLayRead(async () => {
  const p1 = lpObj.getTokens();
  const p2 = lpObj.getTokens();
  const p3 = lpObj.getTokens();

  const result: any = await Promise.all([p1, p2, p3]);
  console.log('result...', result);
  return result;
});

watchEffect(() => {
  console.log('数据变化了。。。', myBalan);
});

/* async function init() {
  const resp1 = await checkInfo();
  console.log('resp1111', resp1, myBalan);
  const resp2 = await checkInfo();
  console.log('resp2222', resp2, myBalan);
} */

// init();

const route = useRoute();
console.log('route222....', route);

const [handleAuth] = useWrite(async () => {
  lpObj.auth('0x6BDb16fDC24679E9dE0A4FF9aDc7A7C36831Cc21');
});

const [handleClick, loadWrite] = useWrite(async () => {
  console.log('这是写啊');
  await lpObj.auth('0x6BDb16fDC24679E9dE0A4FF9aDc7A7C36831Cc21');
});
</script>

<template>
  <div class="test-page-wrap">
    <h2>this is a test page...</h2>
    <div>loading: {{ loading }}</div>
    <div v-loading="loading">myBalance: {{ myBalan }}</div>

    <button @click="handleAuth">写操作</button>

    <BpButton class="click-box" @click="handleClick" v-loading="loadWrite">bp写操作</BpButton>

    <h3>这个是testStore: {{ testStore.test1 }}</h3>

    <div>读取中？ {{ ex.loading }}</div>
    <button @click="ex.refetch">重新读</button>
  </div>
</template>

<style lang="scss" scoped>
.test-page-wrap {
  .click-box {
    width: 150px;
    height: 150px;
  }
}
</style>
