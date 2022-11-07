<script setup lang="ts">
import { bpFormat, bpAdd, bpSub, bpMul, bpDiv, bpFloor, bpFixed, bpEthHex } from '@/utils/bpMath';
import * as math from 'mathjs';
import useStakeContractApi from '@/contractsApi/useStakeContractApi';
import { useRead } from '@/hooks/useAction';
import { useRoute } from 'vue-router';
import useLpToken from '@contApi/useLpToken';
import { LP_CONT } from '@/contracts/address';
import { bpDebounce } from '@/utils/tools';
import { useRouteItem } from '@/router/useRouterTools';

const input = ref('');

const useStake = useStakeContractApi();
const useStake2 = useStakeContractApi();
const useStake3 = useStakeContractApi();

const usdt = useLpToken({ address: LP_CONT.address, abi: LP_CONT.abi });

const [user, userEx] = useRead(async () => {
  const resp = await useStake.userInfo();
  return resp;
});

const [bal, balEx] = useRead(async () => {
  return await usdt.getBalance();
});

// bal.value

const a = ref(123);
const b = ref(456);
const c = ref(789);

setTimeout(() => {
  b.value = 666;
}, 3000);

/* function handleWrite() {
  console.log('click././');
  console.log(useRoute());
} */

const handleWrite = () => {
  console.log('aaaa', useRoute());
  console.log('bbbb', useRouteItem());
  console.log('bal...', bpFormat(bal.value.origin, 0), bal.value.origin / 10 ** 18);
};

console.log('aaaa', useRoute());

const trailing = ref(true);
const leading = ref(false);
const updated = ref(0);

const changeInp = bpDebounce((e) => {
  console.log('aaaa', e.target.value);
}, 3000);

/* window.addEventListener('scroll', myThrottle);
onBeforeUnmount(() => {
  window.removeEventListener('scroll', myThrottle);
}); */

const aaa = ref(1);
</script>

<template>
  <div class="test-store-wrap h-4000px">
    <h1>this is test store...</h1>
    <input type="text" class="bp-input" v-double="2" v-max="12" />
    <input type="text" class="bp-input" v-double="3" v-max="13" />
    <input type="text" class="bp-input" v-double="4" v-max="14" />
    <input type="text" class="bp-input" v-double="-5" v-max="15" />

    <input type="text" class="bp-input" v-double="-5" v-min="1" v-max="16" />

    <bp-button @click="handleWrite">write操作</bp-button>

    {{ user.datas }}

    <input type="text" @input="changeInp" />

    <!-- <div class="h-4000px"></div> -->
  </div>
</template>

<style lang="scss" scoped>
.bp-input {
  border: solid 2px pink;
  @include -margin-x(0.14em, 20px, 10pm);
}
</style>
