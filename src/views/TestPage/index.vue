<script setup lang="ts">
import { LP_MINT_CONT } from '@/contracts/address';
import { useWrite, useRead } from '@hooks/useAction';
import LpToken from '@/contractsApi/LpToken';
import { useTestStore } from '@store/testStore';
import { reactive, ref, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import MintContractApi from '@/contractsApi/MintContractApi';
const lpObj = new LpToken(LP_MINT_CONT);
const mintCont = new MintContractApi();

const testStore = useTestStore();

const a = ref(1);
const aa = reactive({
  b: 1,
});
setInterval(() => {
  a.value++;
}, 1100);

const [fetchTokens, fetchTokensEX] = useRead(async () => {
  const p1 = lpObj.getTokens();
  const p2 = lpObj.getTokens();
  const p3 = lpObj.getTokens();

  const result: any = await Promise.all([p1, p2, p3]);
  console.log('resultssss...', result);
  const aaa = 123;
  return aaa;
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

const tempImg = require('@img/holder.png');
</script>

<template>
  <div class="test-page-wrap">
    <h2>this is a test page...</h2>

    <button @click="handleAuth">写操作</button>
    <img :src="tempImg" alt="" />
    <img src="@img/holder.png" alt="" />
    <BpButton class="click-box" @click="handleClick" v-loading="loadWrite">bp写操作</BpButton>

    <h3>这个是testStore: {{ testStore.test1 }}</h3>

    <div>useLay数据：{{ fetchTokens }}</div>
    <div>读取中？ {{ fetchTokensEX.loading }}</div>
    <div>读取结果？ {{ String(fetchTokensEX.status) }}</div>
    <button @click="fetchTokensEX.refetch">重新读</button>
  </div>
</template>

<style lang="scss" scoped>
img {
  width: 1rem;
}
.test-page-wrap {
  .click-box {
    width: 150px;
    height: 150px;
  }
}
</style>
