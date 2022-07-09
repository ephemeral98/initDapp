<script setup lang="ts">
import { useAppStore } from '@store/appStore';
import { useRouteMeta } from '@/router/useRouterTools';
import { ref } from '@vue/reactivity';

const appStore = useAppStore();
const meta = useRouteMeta();

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

const loadSwitch = ref(false);
/**
 * 切换链
 */
async function handleSwitchChain() {
  if (loadSwitch.value) return;
  loadSwitch.value = true;
  await appStore.switchChain(meta?.needChains?.[0]);
  loadSwitch.value = false;
}
</script>

<template>
  <!-- 链不对，文案显示连接钱包 -->
  <button :class="{ disableBtn: props.disable }">
    <div v-loading="loadSwitch" v-if="!appStore.rightChain" @click="handleSwitchChain">
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
