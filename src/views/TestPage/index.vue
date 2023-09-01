<script setup lang="ts">
import { useRead, useWrite } from '@/hooks/useAction';
import useCoinToken from '@contApi/useCoinToken';
import { EMET_TOKEN_CONT, STAKE_ADDR } from '@/contracts/address';
import { ethers, Provider } from 'ethers';
import { useAppStore } from '@/store/appStore';

const appStore = useAppStore();

const emetObj = useCoinToken({ address: EMET_TOKEN_CONT.address, abi: EMET_TOKEN_CONT.abi });

const [balan, balanEx] = useRead(
  async () => {
    const myBalan = await emetObj.getBalance();

    return myBalan;
  },
  { default: { origin: '0', show: '0' } }
);

const [getDecimal, getDecimalEx] = useRead(
  async () => {
    return await emetObj.getDecimals();
  },
  { default: 18 }
);

const [doAuth, loadDoAuth] = useWrite(async () => {
  await emetObj.auth(STAKE_ADDR);
});

const testSign = async () => {
  console.log('appStore.ethersObj.provider.getSigners...', appStore.ethersObj.provider);
  // const temp = appStore.ethersObj.provider;
  // console.log('temp...', toRaw(temp).getSigner());
  // toRaw(temp).getSigner()
  // const owner = appStore.ethersObj;

  const owner = toRaw(appStore.ethersObj.signerValue);

  const nonce = Date.now() + Math.ceil(Math.random() * 1000);
  const signature = await owner.signMessage(nonce.toString());
  console.log('signature...', nonce.toString(), signature.toString());
  const decodedAddress = ethers.verifyMessage(nonce.toString(), signature.toString());
  console.log(
    'decodeAdd,,',
    nonce.toString(),
    decodedAddress,
    appStore.defaultAccount.toLowerCase() === decodedAddress.toLowerCase()
  );
};
</script>

<template>
  <div class="test-wrap">
    <h1>test wrap page...</h1>
    <div @click="testSign">余额： {{ balan.origin }}</div>

    <div>精度：{{ getDecimal }}</div>

    <bp-button class="px-20" sink @click="doAuth" v-load="loadDoAuth">尝试授权write操作</bp-button>

    <div class="temp-wrap">
      <img src="@img/holder.png" alt="" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.test-wrap {
  height: 100vh;
}

.temp-wrap {
  width: 100px;
  height: 300px;
  background-color: red;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>
