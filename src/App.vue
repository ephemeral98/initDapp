<template>
  <!-- 顶部栏 -->
  <TopBar />

  <!-- 各路由 -->
  <div class="mainContainer" v-if="update">
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
import { useAppStore, storeToRefs } from '@store/appStore';
import { useTestStore } from '@store/testStore';
import { checkRightChain } from '@/router/routerHelp';
import destroyAllStore from '@/utils/destroyAllStore';

import { ref, nextTick, watch } from 'vue';
export default {
  components: {
    TopBar,
  },
  setup() {
    const appStore = useAppStore();
    const testStore = useTestStore();
    const update = ref(true); // 将组件销毁再重建

    /* appStore.$subscribe((mutation, state) => {
      console.log('mmasmaslmutaitait..', mutation, state);
    }); */

    /**
     * 切链or切账号，更新数据
     */
    watch(
      () => [appStore.updateTarget, appStore.defaultAccount],
      () => {
        if (!appStore.lockUpdate) {
          // 更新所有页面内所有组件
          update.value = !update.value;

          // 更新当前链对不对
          checkRightChain();

          // 初始化相关store
          destroyAllStore();
        }

        nextTick(() => {
          update.value = true;
        });
      }
    );

    return {
      update,
    };
  },
};
</script>

<style lang="scss"></style>
