<script setup lang="ts">
const props = defineProps<{
  size?: string; // 尺寸
}>();

const size = computed(() => props.size ?? '30px');
</script>

<template>
  <div :class="['bp-load-wrap']">
    <div></div>
    <div></div>
  </div>
</template>

<style lang="scss" scoped>
$size: v-bind(size);

.bp-load-wrap {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.bp-load-wrap,
.bp-load-wrap > div {
  position: absolute;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}
.bp-load-wrap {
  font-size: 0;
  color: #fff;

  &.dark {
    color: #333;
  }
}
.bp-load-wrap > div {
  display: inline-block;
  float: none;
  background-color: currentColor;
  border: 0 solid currentColor;
}
.bp-load-wrap {
  width: $size;
  height: $size;
}
.bp-load-wrap > div {
  position: absolute;
  top: 50%;
  left: 50%;
  border-radius: 100%;
}
.bp-load-wrap > div:first-child {
  position: absolute;
  width: $size;
  height: $size;
  background: transparent;
  border-style: solid;
  border-width: 2px;
  border-right-color: transparent;
  border-left-color: transparent;
  -webkit-animation: ball-clip-rotate-pulse-rotate 1s cubic-bezier(0.09, 0.57, 0.49, 0.9) infinite;
  -moz-animation: ball-clip-rotate-pulse-rotate 1s cubic-bezier(0.09, 0.57, 0.49, 0.9) infinite;
  -o-animation: ball-clip-rotate-pulse-rotate 1s cubic-bezier(0.09, 0.57, 0.49, 0.9) infinite;
  animation: ball-clip-rotate-pulse-rotate 1s cubic-bezier(0.09, 0.57, 0.49, 0.9) infinite;
}
.bp-load-wrap > div:last-child {
  width: calc($size / 2);
  height: calc($size / 2);
  -webkit-animation: ball-clip-rotate-pulse-scale 1s cubic-bezier(0.09, 0.57, 0.49, 0.9) infinite;
  -moz-animation: ball-clip-rotate-pulse-scale 1s cubic-bezier(0.09, 0.57, 0.49, 0.9) infinite;
  -o-animation: ball-clip-rotate-pulse-scale 1s cubic-bezier(0.09, 0.57, 0.49, 0.9) infinite;
  animation: ball-clip-rotate-pulse-scale 1s cubic-bezier(0.09, 0.57, 0.49, 0.9) infinite;
}
/*
 * Animations
 */
@-webkit-keyframes ball-clip-rotate-pulse-rotate {
  0% {
    -webkit-transform: translate(-50%, -50%) rotate(0deg);
    transform: translate(-50%, -50%) rotate(0deg);
  }
  50% {
    -webkit-transform: translate(-50%, -50%) rotate(180deg);
    transform: translate(-50%, -50%) rotate(180deg);
  }
  100% {
    -webkit-transform: translate(-50%, -50%) rotate(360deg);
    transform: translate(-50%, -50%) rotate(360deg);
  }
}
@-moz-keyframes ball-clip-rotate-pulse-rotate {
  0% {
    -moz-transform: translate(-50%, -50%) rotate(0deg);
    transform: translate(-50%, -50%) rotate(0deg);
  }
  50% {
    -moz-transform: translate(-50%, -50%) rotate(180deg);
    transform: translate(-50%, -50%) rotate(180deg);
  }
  100% {
    -moz-transform: translate(-50%, -50%) rotate(360deg);
    transform: translate(-50%, -50%) rotate(360deg);
  }
}
@-o-keyframes ball-clip-rotate-pulse-rotate {
  0% {
    -o-transform: translate(-50%, -50%) rotate(0deg);
    transform: translate(-50%, -50%) rotate(0deg);
  }
  50% {
    -o-transform: translate(-50%, -50%) rotate(180deg);
    transform: translate(-50%, -50%) rotate(180deg);
  }
  100% {
    -o-transform: translate(-50%, -50%) rotate(360deg);
    transform: translate(-50%, -50%) rotate(360deg);
  }
}
@keyframes ball-clip-rotate-pulse-rotate {
  0% {
    -webkit-transform: translate(-50%, -50%) rotate(0deg);
    -moz-transform: translate(-50%, -50%) rotate(0deg);
    -o-transform: translate(-50%, -50%) rotate(0deg);
    transform: translate(-50%, -50%) rotate(0deg);
  }
  50% {
    -webkit-transform: translate(-50%, -50%) rotate(180deg);
    -moz-transform: translate(-50%, -50%) rotate(180deg);
    -o-transform: translate(-50%, -50%) rotate(180deg);
    transform: translate(-50%, -50%) rotate(180deg);
  }
  100% {
    -webkit-transform: translate(-50%, -50%) rotate(360deg);
    -moz-transform: translate(-50%, -50%) rotate(360deg);
    -o-transform: translate(-50%, -50%) rotate(360deg);
    transform: translate(-50%, -50%) rotate(360deg);
  }
}
@-webkit-keyframes ball-clip-rotate-pulse-scale {
  0%,
  100% {
    opacity: 1;
    -webkit-transform: translate(-50%, -50%) scale(1);
    transform: translate(-50%, -50%) scale(1);
  }
  30% {
    opacity: 0.3;
    -webkit-transform: translate(-50%, -50%) scale(0.15);
    transform: translate(-50%, -50%) scale(0.15);
  }
}
@-moz-keyframes ball-clip-rotate-pulse-scale {
  0%,
  100% {
    opacity: 1;
    -moz-transform: translate(-50%, -50%) scale(1);
    transform: translate(-50%, -50%) scale(1);
  }
  30% {
    opacity: 0.3;
    -moz-transform: translate(-50%, -50%) scale(0.15);
    transform: translate(-50%, -50%) scale(0.15);
  }
}
@-o-keyframes ball-clip-rotate-pulse-scale {
  0%,
  100% {
    opacity: 1;
    -o-transform: translate(-50%, -50%) scale(1);
    transform: translate(-50%, -50%) scale(1);
  }
  30% {
    opacity: 0.3;
    -o-transform: translate(-50%, -50%) scale(0.15);
    transform: translate(-50%, -50%) scale(0.15);
  }
}
@keyframes ball-clip-rotate-pulse-scale {
  0%,
  100% {
    opacity: 1;
    -webkit-transform: translate(-50%, -50%) scale(1);
    -moz-transform: translate(-50%, -50%) scale(1);
    -o-transform: translate(-50%, -50%) scale(1);
    transform: translate(-50%, -50%) scale(1);
  }
  30% {
    opacity: 0.3;
    -webkit-transform: translate(-50%, -50%) scale(0.15);
    -moz-transform: translate(-50%, -50%) scale(0.15);
    -o-transform: translate(-50%, -50%) scale(0.15);
    transform: translate(-50%, -50%) scale(0.15);
  }
}
</style>

<style lang="scss">
.bp-load-wrapper {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  @include flexPos(center);
  background-color: rgba(0, 0, 0, 0.513);

  &.dark {
    background-color: rgba(215, 215, 215, 0.731);
  }
}
</style>
