<template>
  <!-- 顶部栏 -->
  <TopBar />

  <!-- 各路由 -->
  <div id="mainContainer">
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" v-if="$route.meta?.keepAlive" />
      </keep-alive>
      <component :is="Component" v-if="!$route.meta?.keepAlive" />
    </router-view>
  </div>
</template>

<script>
import TopBar from '@cps/TopBar/index.vue';

export default {
  components: {
    TopBar,
  },
  setup() {},
};
</script>

<style lang="scss">
#mainContainer {
  padding-top: $mobTopBarHeight;
  z-index: 2;
  position: relative;
}
</style>
