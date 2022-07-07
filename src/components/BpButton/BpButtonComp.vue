<script setup lang="ts">
import { useAppStore } from '@store/appStore';

const appStore = useAppStore();

const props = defineProps<{
  disable?: boolean; // 置灰按钮
}>();

const emits = defineEmits<{
  (click: 'click'): MouseEvent; // 点击事件
}>();

/**
 * 处理点击
 */
function handleClick() {
  if (props.disable) return;
  emits('click');
}
</script>

<template>
  <!-- 链不对，文案显示连接钱包 -->
  <button :class="{ disableBtn: props.disable }">
    <div v-if="!appStore.rightChain" @click="appStore.switchChain">
      {{ $t('common.1') }}
    </div>

    <!-- 链对了，显示正常文案 -->
    <div v-else @click="handleClick">
      <slot></slot>
    </div>
  </button>
</template>

<style lang="scss" scoped>
.disableBtn {
  background-color: #c9c9c9 !important;
}
</style>
