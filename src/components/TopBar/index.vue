<script setup lang="ts">
import Menu from './Menu.vue';
import WalletBtn from '@cps/WalletBtn/index.vue';
import { useTopBar } from './useTopBar';

const { pickLang, langList, curLang } = useTopBar();

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
      <WalletBtn />
    </div>

    <!-- 移动端菜单 -->
    <Menu :isShowMenu="isOpenMenu" @hide="handleMenu" />
  </div>
</template>

<style lang="scss" scoped>
.top-bar-wrap {
  width: 100%;
  height: $mobTopBarHeight;
  background-color: skyblue;
  @include flexPos(space-between);
  padding: 0 45rem;
  color: #fff;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 999;
}

.top-bar-tools {
  @include flexPos(flex-start);
  position: absolute;
  right: 22rem;

  .account-address,
  .link-btn {
    margin-left: 18rem;
  }

  .lang-container {
    cursor: pointer;
    @include flexPos(flex-start);
    color: #fff;
    font-size: 24rem;

    .icon-lang {
      width: 32rem;
      margin-right: 10rem;
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
  z-index: 9999999;
  position: absolute;

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
