<script setup lang="ts">
import { useRead, useWrite } from '@/hooks/useAction';
import useCoinToken from '@contApi/useCoinToken';
import { EMET_TOKEN_CONT, STAKE_ADDR } from '@/contracts/address';
import useTestStore from '@/store/testStore';
import { sleep } from '@/utils/tools';
import axios from 'axios';

const testStore = useTestStore();
const emetObj = useCoinToken({ address: EMET_TOKEN_CONT.address, abi: EMET_TOKEN_CONT.abi });

const [balan, balanEx] = useRead(
  async () => {
    const myBalan = await emetObj.getBalance();
    console.log('myBalance...', myBalan);
    return myBalan;
  },
  { default: 0 }
);

const [getDecimal, getDecimalEx] = useRead(
  async (item) => {
    // return await emetObj.getDecimals();
    // console.log('睡眠时间:', item);

    // await sleep(item.sleepTime);
    // return item.sleepTime;
    const resp = await axios.get('/api/back/ranking/' + item.text);
    return resp.data.data;
  },
  { default: 18, immediate: false }
);

// testStore.dataEx.doCore();

const [doAuth, loadDoAuth] = useWrite(async () => {
  await emetObj.auth(STAKE_ADDR);
});

const list = reactive([
  {
    id: 1,
    text: 'aaa',
    active: true,
    sleepTime: 100,
  },
  {
    id: 2,
    text: 'bbb',
    active: false,
    sleepTime: 2500,
  },
  {
    id: 3,
    text: 'ccc',
    active: false,
    sleepTime: 300,
  },
]);

const doPick = (item) => {
  list.forEach((it) => {
    it.active = item.id === it.id;
  });
  getDecimalEx.refresh(item);
};
</script>

<template>
  <div class="test-wrap">
    <h1>{{ getDecimal }}</h1>

    <li
      @click="doPick(item)"
      :class="['w-100 h-100 rounded-10 bg-emerald m-20', { '!bg-red': item.active }]"
      v-for="item in list"
      :key="item.id"
    >
      {{ item.text }}
    </li>
  </div>
</template>

<style lang="scss" scoped>
.test-wrap {
  height: 100vh;
}
</style>
