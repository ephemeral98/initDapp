<script setup lang='ts'>
  
// 菜单列表
const menuListValue = reactive([
  {
    id: 1,
    name: $tx('首页00'),
    logo: require('@img/holder.png'),
    urlName: 'home',
    active: false,
  },
  {
    id: 2,
    name: $tx('关于00'),
    logo: require('@img/holder.png'),
    urlName: 'testPage',
    active: false,
  },
]);
</script>

<template>
  <div class="bg-transparent">
    {{ $tc('gg') }}
  </div>
</template>

<style lang="scss" scoped>

</style>