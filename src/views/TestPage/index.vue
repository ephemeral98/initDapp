<script setup lang="ts">
import { useRead, useWrite } from '@/hooks/useAction';
import useCoinToken from '@contApi/useCoinToken';
import { EMET_TOKEN_CONT, STAKE_ADDR } from '@/contracts/address';
import useTestStore from '@/store/testStore';
import { sleep } from '@/utils/tools';
import axios from 'axios';
import { getRandom } from '@/utils/tools';

const testStore = useTestStore();
const emetObj = useCoinToken({ address: EMET_TOKEN_CONT.address, abi: EMET_TOKEN_CONT.abi });

const tempFunc = async (text) => {
  await sleep(2000);
  return await axios.get('/api/back/ranking/' + text);
};

let tempData = reactive({
  aaa: '',
});

const [getDecimal, getDecimalEx] = useRead(
  async (item) => {
    // return await emetObj.getDecimals();
    // console.log('睡眠时间:', item);
    // await sleep(item.sleepTime);
    // return item.sleepTime;
    /*    const resp = await tempFunc(item.text);
    tempData.aaa = resp.data.data;
    console.log('我的余额: ', tempData.aaa);
    return tempData.aaa; */
    // const t = toRaw(tempData);

    // return { aaa: tempData.aaa };

    const myBalan = await emetObj.getBalance(5, item.addr);
    return myBalan;
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
    addr: '0xbBAA0201E3c854Cd48d068de9BC72f3Bb7D26954',
  },
  {
    id: 2,
    text: 'bbb',
    active: false,
    sleepTime: 2500,
    addr: '0x67861Ef9637a146A14B7bE09729F41e8227d603B',
  },
  {
    id: 3,
    text: 'ccc',
    active: false,
    sleepTime: 300,
    addr: '0xb0fE4FB305bc1A2de833fe85C71d129485226ff5',
  },
]);
let temp = true;
const doPick = (item) => {
  if (temp) {
    list.forEach((it) => {
      it.active = item.id === it.id;
      console.log('it...', it.addr);
      getDecimalEx.refresh(it);
    });
  } else {
    for (let i = list.length - 1; i >= 0; i--) {
      const item = list[i];
      console.log('item...', item.addr);
      getDecimalEx.refresh(item);
    }
  }

  temp = !temp;
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

    <button @click="getDecimalEx.cancel">取消请求</button>
  </div>
</template>

<style lang="scss" scoped>
.test-wrap {
  height: 100vh;
}
</style>
