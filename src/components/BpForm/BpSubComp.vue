<script setup lang="ts">
type n = number | string;

const props = withDefaults(
  defineProps<{
    min?: n; // 最小值
    value: n; // 值
  }>(),
  {
    min: 0,
  }
);

const emits = defineEmits<{
  (click: 'update:value'): MouseEvent;
}>();

/**
 * 处理点击
 */
function handleClick() {
  if (props.value <= props.min) {
    emits('update:value', String(+props.min));
    return false;
  }

  emits('update:value', String(+props.value - 1));
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
  background-color: #008c8c;
}
</style>
