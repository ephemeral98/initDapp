<script setup lang="ts">
import { bpFormat, bpAdd, bpSub, bpMul, bpDiv, bpFloor, bpFixed, bpEthHex } from '@/utils/bpMath';
import * as math from 'mathjs';
import useStakeContractApi from '@/contractsApi/useStakeContractApi';
import { useRead } from '@/hooks/useAction';

const useStake = useStakeContractApi();

const [user, userEx] = useRead(async () => {
  return await useStake.userInfo();
});

const a = ref(123);
const b = ref(456);
const c = ref(789);

setTimeout(() => {
  b.value = 666;
}, 3000);
</script>

<template>
  <div class="test-store-wrap h-screen">
    <h1>this is test store...</h1>
    <input type="text" class="bp-input" v-double="2" v-max="12" />
    <input type="text" class="bp-input" v-double="3" v-max="13" />
    <input type="text" class="bp-input" v-double="4" v-max="14" />
    <input type="text" class="bp-input" v-double="-5" v-max="15" />

    <input type="text" class="bp-input" v-double="-5" v-min="1" v-max="16" />

    <bp-button>write操作</bp-button>

    {{ user }}
  </div>
</template>

<style lang="scss" scoped>
.bp-input {
  border: solid 2px pink;
  @include -margin-x(0.14em, 20px, 10pm);
}
</style>
