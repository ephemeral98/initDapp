<script setup lang="ts">
import { menuList } from './useTopBar';
import router from '@/router';
import { ElMessage } from 'element-plus';
import i18n from '@/locales/i18n';
const $t = i18n.global.t;

const props = defineProps<{
  isShowMenu: boolean; // 是否展示菜单
}>();

const $emits = defineEmits<{
  (hide: 'hide'): void; // 隐藏弹窗
}>();

/**
 * 跳转到路由
 */
function launchTo(menu) {
  if (menu.url === '/') {
    ElMessage.info($t('msg.16'));
    return;
  }
  router.push({ name: menu.url });
  $emits('hide');
}

</script>

<template>
  <div class="menu-wrap">
    <!-- 遮罩层 -->
    <div v-show="props.isShowMenu" class="mask" @click="$emits('hide')"></div>
    <!-- 菜单面板 -->
    <transition
      :duration="1000"
      enter-active-class="animate__animated animate__fadeInLeft"
      leave-active-class="animate__animated animate__fadeOutLeft"
    >
      <div class="menu-panel" v-show="props.isShowMenu">
        <!-- 各个路由 -->
        <div class="menu-item" v-for="menu in menuList" :key="menu.id" @click="launchTo(menu)">
          <img :src="menu.logo" alt="" class="menu-logo" />
          <span>{{ $t(menu.name) }}</span>
        </div>

        <!-- 区块浏览器 -->
      </div>
    </transition>
  </div>
</template>

<style lang="scss" scoped>
.mask {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9999;
}

.menu-panel {
  position: fixed;
  left: 0;
  top: 0;
  overflow: auto;
  padding-top: calc($mobTopBarHeight + 0.3rem);
  padding-right: 0.22rem;
  background-color: #e2eeff;
  @include -width(60vw, 400px, 400px);
  width: 60vw;
  height: 100vh; // 菜单栏的高度
  z-index: 10000;
  color: #fff;

  .menu-item {
    @include flexPos(flex-start);
    background-color: #4e92ff;
    border-radius: 0 0.3rem 0.3rem 0;
    padding-left: 0.33rem;
    height: 0.44rem;
    cursor: pointer;
    &:not(:first-child) {
      margin-top: 0.1rem;
    }

    .menu-logo {
      width: 0.25rem;
      margin-right: 0.11rem;
    }
  }
}

.links-wrap {
  @include flexPos(space-between);
  margin-top: 0.5rem;
  padding-left: 0.22rem;

  .icon-link {
    width: 0.36rem;
    height: 0.36rem;
  }
}
</style>
