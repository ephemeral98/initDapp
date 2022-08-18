<script setup lang="ts">
import { IVal } from './types';

type n = number | string;

const props = withDefaults(
  defineProps<{
    min?: n; // 最小值
    refObj: IVal; // 值
  }>(),
  {
    min: 0,
  }
);

const emits = defineEmits<{
  (click: 'update:refObj', refObj: IVal): MouseEvent;
}>();

/**
 * 处理点击
 */
function handleClick() {
  if (props.refObj.show <= props.min) {
    emits('update:refObj', {
      show: String(+props.min),
      origin: String(+props.min),
    });
    return false;
  }

  emits('update:refObj', {
    show: String(+props.refObj.show - 1),
    origin: String(+props.refObj.show - 1),
  });
}
</script>

<template>
  <button class="bp-sub" @click="handleClick">
    <slot>-</slot>
  </button>
</template>

<style lang="scss" scoped>
.bp-sub {
  @include flexPos(center);
}
</style>
