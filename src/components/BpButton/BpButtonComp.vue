<script setup lang="ts">
import { useAppStore } from '@store/appStore';
const appStore = useAppStore();

const props = defineProps<{
  disable?: boolean; // 置灰按钮
  sink: boolean; // 点击下沉效果
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
  <button
    :class="['write-btn func-btn', { disable: props.disable, sink: props.sink }]"
    @click="handleSwitchChain"
  >
    <template v-loading="loadSwitch" v-if="!appStore.rightChain || !appStore.defaultAccount">
      <slot></slot>
    </template>

    <!-- 链对了，显示正常文案 -->
    <template v-else>
      <slot></slot>
    </template>
  </button>
</template>

<style lang="scss" scoped>
.write-btn {
  text-align: center;
  padding-top: 7rem;
}
</style>
