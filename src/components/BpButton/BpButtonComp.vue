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
async function handleSwitchChain() {
  if (props.disable) return;

  emits('click');
}
</script>

<template>
  <!-- 链不对，文案显示连接钱包 -->
  <button :class="{ disableBtn: props.disable }" @click="handleSwitchChain">
    <template v-loading="loadSwitch" v-if="!appStore.rightChain || !appStore.defaultAccount">
      {{ $t('common.1') }}
    </template>

    <!-- 链对了，显示正常文案 -->
    <template v-else>
      <slot></slot>
    </template>
  </button>
</template>

<style lang="scss" scoped>
.disableBtn {
  background-color: #c9c9c9 !important;
}
</style>
