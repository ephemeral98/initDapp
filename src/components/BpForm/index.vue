<script setup lang='ts'>
  const doSubmit = () => {
    console.log('提交订单');
  }
</script>

<template>
  <form form-wrap="bp-form">
    <slot></slot>
  </form>
</template>

<style lang="scss" scoped>

</style>
