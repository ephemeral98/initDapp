<script setup lang="ts">
import { bpAdd, bpSub, bpMul, bpDiv, bpFloor, bpFixed, bpEthHex } from '@/utils/bpMath';
import * as math from 'mathjs';

const a = ref(123);
const b = ref(456);
const c = ref(789);

watchEffect(() => {
  // const res = bpAdd(a.value, b.value);
  // const res = bpAdd(3, 4, { hex: false, deci: 3 });
  // const res2 = bpAdd('222222222222222222', '1111111111111111111111111.123129999999999999999993123');

  let a = bpEthHex('3.9', 2);
  // console.log('aaaal, ', a);

  const res2 = bpDiv(55, 33, { deci: 3 });
  console.log('结果', res2);
  // const res2 = bpFloor(a, 4, true);
  // console.log('res...2222', res2);
  // console.log('res....', res2);

  // console.log('数学？', bpFixed('123.12345', 4, true));

  // console.log(math.fix(3.1239999, 5));

  // const resp = bpFixed('123123.9999999', 4, true);
});

function upGrade(str, i) {
  if (str[i] == 9) {
    str[i] = 0;
    upGrade(str, i - 1);
  } else {
    str[i] = String(+str[i] + 1);
  }
  return str;
}

/* let strs = '6792399';
const arrs = strs.split(''); */

// for (let i = arrs.length - 1; i >= 0; i--) {
// upGrade(arrs, arrs.length - 1);
// console.log(strs[i]);
// console.log(i);
// }

// console.log(arrs.join(''));

const yue = 7;
const arrs2 = '134.6792399 816238';
const reg = /\./g;

const inx = reg.exec(arrs2).index;
const cloneArrs2 = arrs2.slice(inx + 1).slice(0, yue);
// console.log('cloneArrs2...', cloneArrs2);

const zheng = arrs2.slice(0, inx);
// console.log('zh', zheng);

const cloneArrss = cloneArrs2.split('');

upGrade(cloneArrss, cloneArrs2.length - 1);

// console.log('结果...', zheng + '.' +cloneArrss.join(''));
</script>

<template>
  <div>
    <h1>this is test store...</h1>
  </div>
</template>

<style lang="scss" scoped></style>
