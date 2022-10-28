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
  <button :class="['write-btn', { disableBtn: props.disable }]" @click="handleSwitchChain">
    <template v-loading="loadSwitch" v-if="!appStore.rightChain || !appStore.defaultAccount">
      <!-- {{ $t('common.1') }} -->

      <slot></slot>
    </template>

    <!-- 链对了，显示正常文案 -->
    <template v-else>
      <slot></slot>
    </template>
  </button>
</template>

<style lang="scss" scoped>
button {
  display: block;
}
.disableBtn {
  background-color: #c9c9c9 !important;
}

.write-btn {
  $color: skyblue;

  text-align: center;
  background-color: $color;

  box-shadow: 0 5px 0 0 rgb(109, 24, 3);
  padding-top: 0.07rem;

  &:active {
    // box-shadow: 0 1px 0 0 #2877c9;
    box-shadow: 0 5px 0 0 $color;

    transform: translateY(5px);
  }
}
</style>
