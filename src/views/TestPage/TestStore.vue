<script setup lang="ts">
import { bpAdd, bpSub, bpMul, bpDiv, bpFloor, bpFixed, bpEthHex } from '@/utils/bpMath';
import * as math from 'mathjs';

const a = ref(123);
const b = ref(456);
const c = ref(789);
</script>

<template>
  <div>
    <h1>this is test store...</h1>
    <input type="text" class="bp-input" />
  </div>
</template>

<style lang="scss" scoped>
.bp-input {
  border: solid 2px pink;
}
</style>
