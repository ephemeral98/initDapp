<script setup lang="ts">
import { dataWrap } from './testData';
import { useAjax } from '@hooks/useAction';
import { $GET } from '@/service/request';
import { bpThrottle } from '@/utils/tools';
import { useWindowScroll } from '@vueuse/core';
import { useScrollBottom } from '@/hooks/useScrollCallback';

import useDiviPage from '@/hooks/useDiviPage';
const { curPage, loading, finished, finalData: showData, core: init } = useDiviPage(dataWrap);
init();
</script>

<template>
  <div class="text-1rem fixed">
    {{ showData.length }}当前页码：{{ curPage }}

    <div class="text-main-1">
      {{ loading ? 'loading' : 'done' }}
    </div>
    <div class="text-main-1">
      {{ finished ? 'finish' : 'more' }}
    </div>
  </div>
  <div class="bg-main-1">{{ dataWrap.length }}</div>
  <div class="test-store-wrap">
    <div class="item" v-for="(item, inx) in showData" :key="inx">
      <div class="title">
        {{ inx }}
      </div>
      <div>{{ item }}</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.item {
  height: 250px;
  background-color: pink;
  margin: 0.2rem;
  overflow: auto;

  .title {
    font-size: 1rem;
  }
}
</style>
