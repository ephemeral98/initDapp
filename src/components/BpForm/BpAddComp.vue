<script setup lang="ts">
type n = number | string;
const props = defineProps<{
  max?: n; // 最大值
  value: n; // 值
}>();

const emits = defineEmits<{
  (click: 'update:value'): MouseEvent;
}>();

/**
 * 处理点击
 */
function handleClick() {
  if (props.value >= props.max) {
    emits('update:value', String(+props.max));

    return false;
  }

  emits('update:value', String(+props.value + 1));
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
