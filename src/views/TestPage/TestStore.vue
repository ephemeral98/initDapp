<script setup lang="ts">
import { bpFormat, bpAdd, bpSub, bpMul, bpDiv, bpFloor, bpFixed, bpEthHex } from '@/utils/bpMath';
import * as math from 'mathjs';
import useStakeContractApi from '@/contractsApi/useStakeContractApi';
import { useRead } from '@/hooks/useAction';
import { useRoute } from 'vue-router';
import useLpToken from '@contApi/useLpToken';
import { LP_CONT } from '@/contracts/address';
import { refThrottled, refDebounced, useDebounceFn } from '@vueuse/core';
import { handleThrottle, bpDebounce } from '@/utils/tools';

const input = ref('');
// const throttled = refThrottled(input, 1000, false);

const useStake = useStakeContractApi();
const useStake2 = useStakeContractApi();
const useStake3 = useStakeContractApi();

const usdt = useLpToken({ address: LP_CONT.address, abi: LP_CONT.abi });

const [user, userEx] = useRead(async () => {
  console.log('重新读');
  return await useStake.userInfo();
});

useRead(async () => {
  await usdt.getBalance();
});

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
};

const trailing = ref(true);
const leading = ref(false);
const updated = ref(0);

const throttled = refThrottled(input, 1000, false);

watch(throttled, () => {
  updated.value += 1;
});

const input2 = ref('foo');
const debounced = refDebounced(input2, 1000);

input.value = 'bar';
console.log(debounced.value); // 'foo'

console.log(debounced.value); // 'bar'

const debouncedFn = useDebounceFn((e) => {
  // do something
  console.log(e.target.value);
}, 150);

const myThrottle = bpDebounce((e) => {
  console.log(e);
}, 1000);
const myThrottle2 = bpDebounce(() => {
  console.log(new Date().getTime());
}, 1050);
const myThrottle3 = bpDebounce(() => {
  console.log(new Date().getTime());
}, 1050);

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

    <div class="my-2">
      <input v-model="input" placeholder="Try to type anything..." type="text" />
      <p>Throttled: {{ throttled }}</p>
      <p>Times Updated: {{ updated }}</p>
      <p>Trailing: {{ trailing }}</p>
      <p>Leading: {{ leading }}</p>
    </div>

    <div class="my-2">
      <div>{{ aaa }}</div>
      <input type="text" @input="myThrottle"/>
    </div>

    <bp-button @click="handleWrite">write操作</bp-button>

    {{ user }}

    <!-- <div class="h-4000px"></div> -->
  </div>
</template>

<style lang="scss" scoped>
.bp-input {
  border: solid 2px pink;
  @include -margin-x(0.14em, 20px, 10pm);
}
</style>
