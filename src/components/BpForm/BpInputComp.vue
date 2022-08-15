<script setup lang="ts">
import { useAppStore } from '@store/appStore';
import { ethers } from 'ethers';
const appStore = useAppStore();

type n = number | string;

const props = withDefaults(
  defineProps<{
    max?: n; // 最大值
    min?: n; // 最小值
    type?: 'int' | 'double.3'; // 类型:整数、小数(小数可以约定几位，这里的2表示两位)
    value: n;
  }>(),
  {
    min: 0,
    type: 'int',
  }
);

const emits = defineEmits<{
  (input: 'update:value'): KeyEvent; // 点击事件
}>();

// 输入值
const inpVal = ref('');

function handleInp(e) {
  // console.log('eee', e.target.value);
  const val = e.target.value;
  // 正整数
  if ((/\D+/.test(+val) || /\./g.test(val)) && props.type === 'int') {
    console.log('非数。。。', props.value);
    e.target.value = props.value;
    return false;
  }

  console.log('props.type?.include...', props.type);
  // 小数
  if (props.type?.includes?.('double')) {
    // const len = props.type.split('.')[1] || 2; // 约小数后几位
    console.log('len...', len);
    e.target.value = e.target.value.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1');
    return false;
  }

  // 区间
  if (props.max && +val >= props.max) {
    inpVal.value = props.max;
  } else {
    inpVal.value = val;
  }
  e.target.value = inpVal.value;
  emits('update:value', String(inpVal.value));
}
</script>

<template>
  <input type="text" @input="handleInp" :value="props.value" />
  <div>值是：{{ props.value }}</div>
</template>

<style lang="scss" scoped>
button {
  display: block;
}
.disableBtn {
  background-color: #c9c9c9 !important;
}
</style>
