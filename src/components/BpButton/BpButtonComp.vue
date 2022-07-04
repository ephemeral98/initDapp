<script setup lang="ts">
import { useAppStore } from '@store/appStore';

const appStore = useAppStore();

const props = defineProps<{
  click: () => MouseEvent;
}>();
</script>

<template>
  <button @click="props.click">
    <!-- 链不对，文案显示连接钱包 -->
    <template v-if="!appStore.rightChain" @click="appStore.linkWallet"> {{ $t('common.1') }} </template>

    <!-- 链对了，显示正常文案 -->
    <template v-else>
      <slot></slot>
    </template>
  </button>
</template>

<style lang="scss" scoped></style>
