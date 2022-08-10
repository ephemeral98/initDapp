<script setup lang="ts">
import { getCurrentInstance, reactive } from 'vue';
import { useAppStore } from '@store/appStore';
import { computed, ref } from '@vue/reactivity';
import { plusXing } from '@/utils/tools';
import MintContractApi from '@/contractsApi/MintContractApi';

const gThis = getCurrentInstance().appContext.config.globalProperties;
const appStore = useAppStore();

const mintObj = new MintContractApi();
console.log('mintObj...', mintObj);

// 语言栏
const langList = reactive([
  {
    id: 1,
    name: '中',
    target: 'cn',
    active: false,
  },
  {
    id: 2,
    name: 'En',
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
  <div class="top-bar-wrap">顶部栏</div>
</template>

<style lang="scss" scoped>
.top-bar-wrap {
  width: 100%;
  height: $mobTopBarHeight;
  @include flexPos(space-between);
  padding: 0 0.15rem;
  position: absolute;
  left: 0;
  top: 0;

  .lang-container {
    cursor: pointer;
    @include flexPos(center);
    font-size: 0.28rem;
    color: #fff;
    margin-left: 0.4rem;

    .icon-lang {
      width: 0.41rem;
      margin-right: 0.1rem;
    }
  }
}

.tools-wrap {
  position: absolute;
  top: 0.48rem;
  @include -right(0.5rem, 1rem, 3.72rem);
  @include flexPos(center);
}

.toggle-container {
  $boxHeight: 0.24rem;
  $barHeight: 3px;
  cursor: pointer;

  height: 0.24rem;
  @include flexPos(space-between);
  flex-direction: column;
  .bar {
    transition: 0.4s;
    width: 0.3rem;
    height: $barHeight;
    background-color: #000;
    transform-origin: center;
  }
}

.account-box {
  padding: 0.08rem 0.24rem;
  @include flexPos(center);
  color: #833200;
  background-color: #fff;
  border-radius: 1rem;

  .icon-wallet {
    margin-right: 0.1rem;
    width: 0.24rem;
  }
}
</style>
