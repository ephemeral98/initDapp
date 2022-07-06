<script setup lang="ts">
import { getCurrentInstance, reactive } from 'vue';
import { useAppStore } from '@store/appStore';
import { computed, ref } from '@vue/reactivity';
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

// 菜单是否为开启状态
const isOpenMenu = ref(false);
function handleMenu() {
  isOpenMenu.value = !isOpenMenu.value;
  // 控制外部滚动条是否能滚动
  document.body.style.overflow = isOpenMenu.value ? 'hidden' : 'auto';
}
</script>

<template>
  <div class="top-bar-wrap">
    <!-- 右边控制菜单显示和隐藏 -->
    <div :class="['toggle-container', { close: isOpenMenu }]" @click="handleMenu">
      <div class="bar"></div>
      <div class="bar"></div>
    </div>

    <div>
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
  </div>
</template>

<style lang="scss" scoped>
.top-bar-wrap {
  width: 100%;
  height: 0.8rem;
  background-color: skyblue;
  @include flexPos(space-between);

  .lang-container {
    cursor: pointer;
  }
}

.toggle-container {
  $boxHeight: 0.24rem;
  $barHeight: 0.05rem;
  cursor: pointer;

  height: 0.24rem;
  @include flexPos(space-between);
  flex-direction: column;
  .bar {
    transition: 0.4s;

    width: 0.48rem;
    height: $barHeight;
    background-color: #000;
    transform-origin: center;

    &:nth-child(2) {
      // margin-top: 0.2rem;
    }
  }

  &.close {
    $y: calc($boxHeight / 2 - $barHeight / 2);
    .bar:nth-child(1) {
      transform: translateY($y) rotate(45deg);
    }

    .bar:nth-child(2) {
      transform: translateY(-$y) rotate(-45deg);
    }
  }
}
</style>
