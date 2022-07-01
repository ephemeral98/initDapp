<template>
  <!-- 顶部栏 -->
  <TopBar />

  <!-- 各路由 -->
  <div v-if="update">
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" v-if="$route.meta?.keepAlive" />
      </keep-alive>
      <component :is="Component" v-if="!$route.meta?.keepAlive" />
    </router-view>
  </div>
</template>

<script>
import TopBar from '@cps/TopBar';
import { useAppStore, storeToRefs } from '@store/appStore';
import {
  onMounted,
  onBeforeMount,
  ref,
  getCurrentInstance,
  watchEffect,
  nextTick,
  watch,
} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
export default {
  components: {
    TopBar,
  },
  setup() {
    const appStore = useAppStore();
    const { welcoming } = storeToRefs(appStore);

    const route = useRoute();
    const router = useRouter();

    const update = ref(true); // 将组件销毁再重建
    /**
     * 控制语言面板
     */
    function handleTouch(e) {
      const panel = document.querySelector('#lang-panel');
      if (panel && !panel.contains(e.target)) {
        appStore.setIsShowLangPanel(false);
      }
    }

    /* appStore.$subscribe((mutation, state) => {
      console.log('mmasmaslmutaitait..', mutation, state);
    }); */

    watch(
      () => appStore.ethersObj.connected,
      () => {
        console.log('appStore.ethersObj.connected..', appStore.ethersObj.connected);
        if (appStore.ethersObj.connected) {
          update.value = !update.value;
        }

        nextTick(() => {
          update.value = true;
        });
      }
    );

    return {
      welcoming,
      route,
      update,
    };
  },
};
</script>

<style lang="scss">
// body {
//   width:100%;
//   position:fixed;
// }
</style>
