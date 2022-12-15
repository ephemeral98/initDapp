<script setup lang="ts">
import { getCurrentInstance, reactive } from 'vue';
import { useAppStore } from '@store/appStore';
import { computed, ref } from '@vue/reactivity';
import { plusXing } from '@/utils/tools';
import Menu from './Menu.vue';

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
  return langList.find((item) => item.active)?.name ?? langList[1].name;
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
  <div class="top-bar-wrap">
    <!-- 控制菜单显示和隐藏 按钮 -->
    <div :class="['toggle-container', { opening: isOpenMenu }]" @click="handleMenu">
      <div class="bar"></div>
      <div class="bar"></div>
      <div class="bar"></div>
    </div>

    <!-- 一些工具：钱包、选择语言等 -->
    <div class="top-bar-tools">
      <!-- 选择语言 -->
      <el-dropdown trigger="click" @command="pickLang">
        <div class="lang-container">
          <img src="@img/icon-lang.png" alt="" class="icon-lang" />
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

      <!-- 已链接钱包展示钱包地址 -->
      <div v-if="appStore.defaultAccount" class="account-address">
        {{ plusXing(appStore.defaultAccount, 4, 4) }}
      </div>

      <!-- 连接钱包 -->
      <button v-loading="loadLink" v-else class="link-btn" @click="handleLink">
        {{ $t('common.1') }}
      </button>
    </div>
  </div>
  <!-- 移动端菜单 -->
  <Menu :isShowMenu="isOpenMenu" @hide="handleMenu" />
</template>

<style lang="scss" scoped>
.top-bar-wrap {
  width: 100%;
  height: $mobTopBarHeight;
  background-color: skyblue;
  @include flexPos(space-between);
  padding: 0 0.15rem;
  color: #fff;
}

.top-bar-tools {
  @include flexPos(flex-start);

  .account-address,
  .link-btn {
    margin-left: 0.18rem;
  }

  .lang-container {
    cursor: pointer;
    @include flexPos(flex-start);
    color: #fff;

    .icon-lang {
      width: 0.32rem;
      margin-right: 0.1rem;
    }
  }
}

.toggle-container {
  $boxHeight: 15px;
  $barHeight: 3px;
  cursor: pointer;

  height: 15px;
  @include flexPos(space-between);
  flex-direction: column;
  .bar {
    transition: 0.4s;
    width: 20px;
    height: $barHeight;
    background-color: #000;
    transform-origin: center;
  }

  &.opening {
    $y: calc($boxHeight / 2 - $barHeight / 2);
    $dy: calc((-#{$boxHeight} / 2 + #{$barHeight} / 2));

    .bar:nth-child(1) {
      transform: translateY($y) rotate(45deg);
    }
    .bar:nth-child(2) {
      opacity: 0;
    }
    .bar:nth-child(3) {
      transform: translateY($dy) rotate(-45deg);
    }
  }
}
</style>
