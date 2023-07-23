<script setup lang="ts">
import useScrollAnimate from './useScrollAnimate';
const app = document.getElementById('app');

const { playgroundRef, boxItemRef, listRef, setItemRef, updateAnimate, updateMap } =
  useScrollAnimate();

/**
 * 监听滚动
 */
onMounted(() => {
  updateMap();
  app.addEventListener('scroll', () => {
    updateAnimate();
  });
});
onBeforeMount(() => {
  app.removeEventListener('scroll', updateAnimate);
});
</script>

<template>
  <div class="scroll-animate-wrap">
    <header class="h-200 bg-blue flex-center text-52">这个是滚动测试😄</header>
    <!-- 主要模块 -->
    <main class="ani-playground" ref="playgroundRef">
      <!-- 动画展示模块 -->
      <div class="ani-container">
        <!-- 要展示动画的列表 -->
        <div class="list" ref="listRef">
          <div :ref="setItemRef" data-order="0" class="item-box"></div>
          <div :ref="setItemRef" data-order="1" class="item-box"></div>
          <div :ref="setItemRef" data-order="2" class="item-box"></div>
          <div :ref="setItemRef" data-order="3" class="item-box"></div>
          <div :ref="setItemRef" data-order="2" class="item-box"></div>
          <div :ref="setItemRef" data-order="1" class="item-box"></div>
          <div :ref="setItemRef" data-order="0" class="item-box"></div>
          <div :ref="setItemRef" data-order="0" class="item-box"></div>
          <div :ref="setItemRef" data-order="1" class="item-box"></div>
          <div :ref="setItemRef" data-order="2" class="item-box"></div>
          <div :ref="setItemRef" data-order="3" class="item-box"></div>
          <div :ref="setItemRef" data-order="2" class="item-box"></div>
          <div :ref="setItemRef" data-order="1" class="item-box"></div>
          <div :ref="setItemRef" data-order="0" class="item-box"></div>
        </div>
      </div>
    </main>
    <!-- 路人模块 -->
    <section class="flex-center h-800px">路人模块😁</section>
    <footer class="h-200 bg-pink flex-center text-52">这个是滚动测试😄结束</footer>
  </div>
</template>

<style lang="scss" scoped>
.ani-playground {
  width: 100%;
  height: 200vh;
  background-color: #008c8c;
}

.ani-container {
  width: 100vw;
  height: 120vh;
  background-color: rgba(255, 0, 72, 0.995);
  position: sticky;
  left: 0;
  top: 0;
  @include flexPos(center);
}

.list {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  place-items: center;
  grid-gap: 150rem 0;

  .item-box {
    width: 100px;
    height: 100px;
    background-color: orange;
    border-radius: 16rem;
    opacity: 0;
  }
}
</style>
