<script setup lang="ts">
import { useAppStore } from '@/store/appStore';
import { plusStar } from '@/utils/tools';

const appStore = useAppStore();

const loadLink = ref(false);
/**
 * 连接钱包
 */
async function handleLink() {
  if (loadLink.value) return;
  loadLink.value = true;
  await appStore.linkWallet();
  loadLink.value = false;
}
</script>

<template>
  <div class="wallet-wrap text-24">
    <!-- 已链接钱包展示钱包地址 -->
    <div v-if="appStore.defaultAccount" class="account-address">
      {{ plusStar(appStore.defaultAccount, 4, 4) }}
    </div>

    <!-- 连接钱包 -->
    <button v-load="loadLink" v-else class="link-btn" @click="handleLink">
      {{ $t('base.1') }}
    </button>
  </div>
</template>

<style lang="scss" scoped>
.wallet-wrap {
  .account-address,
  .link-btn {
    height: calc($mobTopBarHeight - $walletBtnMenuGap);
    padding: 0 30rem;
    @include flexPos(center);
    font-size: 24rem;
    border-radius: 8rem;
  }

  .lang-container {
    cursor: pointer;
    @include flexPos(flex-start);
    color: #fff;

    .icon-lang {
      width: 32rem;
      margin-right: 10rem;
    }
  }
}
</style>
