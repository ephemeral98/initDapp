<script setup lang="ts">
import { $GET } from '@/hooks/useAjax';

const isLogin = await $GET('/api/test/whoami', {
  other: 'hello',
});
</script>

<template>
  <div class="home-wrap">this is home page...</div>
</template>

<style lang="scss" scoped></style>
