<script setup lang="ts">
import { IVal } from './types';
type n = number | string;

const props = defineProps<{
  max?: n; // 最大值
  refObj: IVal; // 值
}>();

const emits = defineEmits<{
  (click: 'update:refObj', refObj: IVal): MouseEvent;
}>();

/**
 * 处理点击
 */
function handleClick() {
  if (+props.refObj.show >= +props.max) {
    emits('update:refObj', { show: String(props.max), origin: String(props.max) });

    return false;
  }

  emits('update:refObj', {
    show: String(+props.refObj.show + 1),
    origin: String(+props.refObj.show + 1),
  });
}
</script>

<template>
  <button class="bp-add" @click="handleClick">
    <slot>+</slot>
  </button>
</template>

<style lang="scss" scoped>
.bp-add {
  @include flexPos(center);
}
</style>
