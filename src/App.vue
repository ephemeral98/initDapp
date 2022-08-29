<template>
  <!-- 顶部栏 -->
  <TopBar />

  <!-- 各路由 -->
  <div class="mainContainer">
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

<style lang="scss"></style>
