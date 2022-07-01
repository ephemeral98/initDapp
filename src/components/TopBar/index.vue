<script setup lang="ts">
import { getCurrentInstance, reactive } from 'vue';
import { useAppStore } from '@store/appStore';
import { computed } from '@vue/reactivity';
import { plusXing } from '@/utils/tools';

const gThis = getCurrentInstance().appContext.config.globalProperties;
const appStore = useAppStore();

// 语言栏
const langList = reactive([
  {
    id: 1,
    name: '中文',
    target: 'cn',
    active: false,
  },
  {
    id: 2,
    name: 'English',
    target: 'en',
    active: true,
  },
]);

langList.forEach((item) => {
  item.active = item.target === appStore.curLang;
});

// 当前选中语言
const curLang = computed(() => {
  return langList.find((item) => item.active).name;
});

/**
 * 选择语言
 */
function pickLang(lang) {
  gThis.$i18n.locale = lang.target;
  appStore.setLang(lang.target);
  langList.forEach((item) => {
    item.active = lang.id === item.id;
  });
}
</script>

<template>
  <div class="top-bar-wrap">
    <div>这是顶部栏 《{{ $t('msg.1') }}》多语言</div>

    <!-- 已链接钱包展示钱包地址 -->
    <div v-if="!appStore.defaultAccount" class="account-address">
      {{ plusXing(appStore.defaultAccount, 4, 4) }}
    </div>

    <!-- 连接钱包 -->
    <button v-else class="link-btn" @click="appStore.linkWallet()">{{ $t('common.1') }}</button>

    <!-- 选择语言 -->
    <el-dropdown trigger="click" @command="pickLang">
      <div class="lang-container">
        <span>{{ curLang }}</span>
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item :command="lang" v-for="lang in langList" :key="lang.id">{{
            lang.name
          }}</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<style lang="scss" scoped>
.top-bar-wrap {
  width: 100%;
  height: 0.8rem;
  background-color: skyblue;

  .lang-container {
    cursor: pointer;
  }
}
</style>
