<!-- 语言折叠面板 -->
<script setup lang="ts">
import { useTopBar } from './useTopBar';

const { curLang, pickLang, langList } = useTopBar();
</script>

<template>
  <el-collapse>
    <el-collapse-item class="menu-tab lang-wrap" :name="1">
      <template #title>
        <div class="px-50 py-20 flex justify-between items-center w-full h-full mr-[12rem]">
          <div class="flex items-center">
            <div>{{ $t('base.17') }}</div>
          </div>
          <div>{{ curLang }}</div>
        </div>
      </template>

      <div
        @click="pickLang(item)"
        class="text-28 menu-item lang"
        v-for="item in langList"
        :key="item.id"
      >
        {{ item.name }}
      </div>
    </el-collapse-item>
  </el-collapse>
</template>

<style lang="scss" scoped>
@import './index.scss';

.menu-item {
  @include flexPos(flex-start);
  @include mixItem();

  &:not(:last-child)::after {
    @include menuItemLine();
  }

  &.lang {
    padding: 0 50rem;
    justify-content: flex-end;
    color: #fff;
  }
}
</style>
