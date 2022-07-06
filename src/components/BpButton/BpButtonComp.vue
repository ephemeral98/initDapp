<script setup lang="ts">
import { useAppStore } from '@store/appStore';

const appStore = useAppStore();

// const props = defineProps<{}>();

const emits = defineEmits<{
  click: () => MouseEvent; // 点击事件
}>();
</script>

<template>
  <button @click="emits.click">
    <!-- 链不对，文案显示连接钱包 -->
    <template v-if="!appStore.rightChain" @click="appStore.switchChain">
      {{ $t('common.1') }}
    </template>

    <!-- 链对了，显示正常文案 -->
    <template v-else>
      <slot></slot>
    </template>
  </button>
</template>

<style lang="scss" scoped></style>
