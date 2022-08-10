<script setup lang="ts">
import { Swiper } from 'swiper/vue';
import { computed, ref, defineExpose } from 'vue';
const $emits = defineEmits(['handleChange']);

const props = defineProps({
  // 混入swiper选项
  option: {
    type: Object,
  },

  slidePage: {
    type: String,
    defalut: 0,
  },
});

const swiper_options: any = computed(() => {
  return {
    autoplay: {
      disableOnInteraction: true, // 鼠标滑动后继续自动播放
      delay: 3000, // 4秒切换一次
    },
    speed: 500, //切换过渡速度
    loop: true,
    mousewheel: true, // 鼠标滚轮
    slidesPerView: 'auto', //设置slider容器能够同时显示的slides数量(carousel模式)。另外，支持'auto'值，会根据容器container的宽度调整slides数目。
    centeredSlides: true, //设置slide居中
    spaceBetween: 20,
    coverflowEffect: {
      rotate: 0, //slide做3d旋转时Y轴的旋转角度。默认50。
      stretch: -10, //每个slide之间的拉伸值（距离），越大slide靠得越紧。 默认0。
      depth: 100, //slide的位置深度。值越大z轴距离越远，看起来越小。 默认100。
      modifier: 1, //depth和rotate和stretch的倍率，相当于            depth*modifier、rotate*modifier、stretch*modifier，值越大这三个参数的效果越明显。默认1。
      slideShadows: false, //开启slide阴影。默认 true。
    },
    observer: true, //修改swiper自己或子元素时，自动初始化swiper
    observeParents: true, //修改swiper的父元素时，自动初始化swiper
    observeSlideChildren: true,
    ...props.option,
  };
});

/**
 * 滑动时候触发，可拿到索引
 */
function handleChange(item) {
  $emits('handleChange', item);
}

/**
 * 跳转到指定页
 */
function handleSlide(page: number) {
  swiperObj.value.slideTo(page);
}

const swiperObj = ref(null);
defineExpose({
  handleSlide,
});
</script>

<template>
  <swiper
    :autoplay="swiper_options.autoplay"
    :loop="swiper_options.loop"
    :speed="swiper_options.speed"
    :spaceBetween="swiper_options.spaceBetween"
    :coverflowEffect="swiper_options.coverflowEffect"
    :centeredSlides="swiper_options.centeredSlides"
    :slidesPerView="swiper_options.slidesPerView"
    :mousewheel="swiper_options.mousewheel"
    :pagination="swiper_options?.pagination"
    :navigation="swiper_options?.navigation"
    :observer="swiper_options.observer"
    :observeParents="swiper_options.observeParents"
    :observeSlideChildren="swiper_options.observeSlideChildren"
    @slideChange="handleChange"
    @swiper="(Swiper) => (swiperObj = Swiper)"
    :virtualIndex="3"
  >
    <slot></slot>
  </swiper>
</template>

<style lang="scss" scoped></style>
