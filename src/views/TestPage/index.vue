<script setup lang="ts">
import { useWrite, useRead } from '@hooks/useAction';
import useTestStore from '@store/testStore';
// import { reactive, ref, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import MintContractApi from '@/contractsApi/useMintContractApi';
import CoinToken from '@/contractsApi/useCoinToken';
import { EMET_TOKEN_CONT } from '@/contracts/address';
import TestMintContract from './TestMintContract.vue';
import TestLp from './TestLp.vue';

console.log('渲染了页面。。');
const { auth, allow, getBalance, balanceObj, hasAllow, created, totalSupply } = CoinToken({
  address: EMET_TOKEN_CONT.address,
  abi: EMET_TOKEN_CONT.abi,
});

// getBalance();
const [datas, dataEx] = useRead(
  async () => {
    const resp = await Promise.all([
      allow('0x6BDb16fDC24679E9dE0A4FF9aDc7A7C36831Cc21'),
      getBalance(),
    ]);
    console.log('resp...', resp);
    return resp[1];
  },
  { watcher: created }
);

const [decimal, dataDecimalEx] = useRead(async () => {
  return await totalSupply();
});

// watch(getBalance());
// setInterval(getBalance, 3000);

// const mintCont = new MintContractApi();

const testStore = useTestStore();

const a = ref(1);
const aa = reactive({
  b: 1,
});
setInterval(() => {
  a.value++;
}, 1100);

const [fetchTokens, fetchTokensEX] = useRead(async () => {});

/* async function init() {
  const resp1 = await checkInfo();
  console.log('resp1111', resp1, myBalan);
  const resp2 = await checkInfo();
  console.log('resp2222', resp2, myBalan);
} */

// init();

const route = useRoute();
console.log('route222....', route);

const [handleClick, loadWrite] = useWrite(async () => {
  console.log('这是写啊');
  // await lpObj.auth('0x6BDb16fDC24679E9dE0A4FF9aDc7A7C36831Cc21');
  await auth('0x6BDb16fDC24679E9dE0A4FF9aDc7A7C36831Cc21');
});

const tempImg = require('@img/holder.png');

const inpValue = ref('2222');

function handleAdd() {
  inpValue.value++;
}

function tempInp(e) {
  console.log('eeee', e.target.value);
  e.target.value = e.target.value.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1');
}
</script>

<template>
  <div class="test-page-wrap">
    <h2>this is a test page...</h2>

    <img :src="tempImg" alt="" />
    <img src="@img/holder.png" alt="" />
    <BpButton class="click-box" @click="handleClick" v-loading="loadWrite">bp写操作</BpButton>

    <h3>这个是testStore: {{ testStore.test1 }}</h3>

    <div>useLay数据：{{ fetchTokens }}</div>
    <div>读取中？ {{ fetchTokensEX.loading }}</div>
    <div>读取结果？ {{ String(fetchTokensEX.status) }}</div>
    <button @click="fetchTokensEX.refetch">重新读</button>

    <hr />

    <div>{{ dataEx.loading }}</div>
    <div>余额：{{ datas }}</div>
    <div>授权了吗？{{ hasAllow }}</div>

    <div>decimals？？？: {{ decimal }}</div>

    <TestMintContract />

    <TestLp />
    <!-- <div>{{ balanceObj }}</div> -->

    <el-button>自动导入element按钮</el-button>

    <!-- <input type="text" maxlength="5"> -->
    <bp-input type="double" :max="666" v-model:value="inpValue"></bp-input>
    {{ inpValue }}

    <bp-add v-model:value="inpValue" :max="333" />
    <bp-sub v-model:value="inpValue" :min="-2" />
    {{ inpValue }}

    aa<input type="text" @keyup="tempInp" />

    <!-- <bp-form>
      <bp-input></bp-input>
      <add-btn></add-btn>
      <minu-btn></minu-btn>
    </bp-form> -->
  </div>
</template>

<style lang="scss" scoped>
img {
  width: 1rem;
}
.test-page-wrap {
  div {
    margin: 0.3rem 0;
  }

  .click-box {
    width: 150px;
    height: 150px;
  }
}
</style>
