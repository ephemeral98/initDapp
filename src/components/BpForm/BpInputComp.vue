<script setup lang="ts">
import { i } from 'mathjs';
import { IVal } from './types';

const props = withDefaults(
  defineProps<{
    max?: any; // 最大值
    // min?: n; // 最小值
    type?: 'int' | 'double'; //  类型:整数、小数 double.2 (小数可以约定几位，这里的2表示两位)
    refObj: IVal;
  }>(),
  {
    // min: 0,
    type: 'int',
  }
);

const emits = defineEmits<{
  (input: 'update:refObj', refObj: IVal): KeyboardEvent; // 输入事件
}>();

// 输入值
const inpVal = ref('');

function handleInp(e) {
  console.log('eee', e);

  // 按了删除键
  if (e?.inputType === 'deleteContentBackward') {
    emits('update:refObj', { show: e.target.value, origin: e.target.value });
    return false;
  }

  // 如果需要负数，可以用e判断

  const val = e.target.value;
  // 正整数
  if ((/\D+/.test(val) || /\./g.test(val)) && props.type === 'int') {
    e.target.value = props.refObj.show;
    return false;
  }

  // 正小数
  if (props.type?.includes?.('double')) {
    const len = props.type.split('.')[1] || 2; // 约小数后几位
    let reg = new RegExp(`^\\D*(\\d*(?:\\.\\d{0,${len}})?).*$`, 'g');
    e.target.value = e.target.value.replace(reg, '$1');

    // 超过了最最大值
    if (props.max && +val >= +props.max) {
      inpVal.value = String(props.max);
      e.target.value = inpVal.value;
    }

    emits('update:refObj', { show: e.target.value, origin: e.target.value });

    return false;
  }

  // 区间
  function _section() {
    if (props.max && +val >= +props.max) {
      inpVal.value = String(props.max);
      e.target.value = inpVal.value;
    } else {
      inpVal.value = val; // 保存到props.value
    }
  }
  _section();
  emits('update:refObj', { show: inpVal, origin: inpVal });
}
</script>

<template>
  <input type="text" @input="handleInp" :value="props.refObj.show" />
</template>

<style lang="scss" scoped></style>
