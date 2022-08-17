<script setup lang="ts">
type n = number | string;

const props = withDefaults(
  defineProps<{
    max?: n; // 最大值
    // min?: n; // 最小值
    type?: 'int' | 'double.3'; // 类型:整数、小数(小数可以约定几位，这里的2表示两位)
    value: n;
  }>(),
  {
    // min: 0,
    type: 'int',
  }
);

const emits = defineEmits<{
  (input: 'update:value', value: string): KeyboardEvent; // 输入事件
}>();

// 输入值
const inpVal = ref('');

function handleInp(e) {
  // console.log('eee', e.target.value);
  const val = e.target.value;
  // 正整数
  if ((/\D+/.test(val) || /\./g.test(val)) && props.type === 'int') {
    e.target.value = props.value;
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

    emits('update:value', String(e.target.value));

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
  emits('update:value', String(inpVal.value));
}
</script>

<template>
  <input type="text" @input="handleInp" :value="props.value" />
</template>

<style lang="scss" scoped></style>
