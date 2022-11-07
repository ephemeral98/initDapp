<script setup lang="ts">
import { Swiper, useSwiper } from 'swiper/vue';
import { Pagination, Navigation } from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// 安装的模块【下面小点，左右箭头】
const modules = [Pagination, Navigation];

const props = defineProps<{
  option; // 混入swiper选项
}>();

const swiperOptions: any = computed(() => {
  return {
    autoplay: {
      delay: 3000, // 自动轮播间隔时间
      disableOnInteraction: false,
      pauseOnMouseEnter: false, // 鼠标移入暂停
      reverseDirection: false, // 往返跑
    },
    loop: true,
    speed: 500, //切换过渡速度
    mousewheel: true, // 鼠标滚轮
    slidesPerView: 'auto', //设置slider容器能够同时显示的slides数量(carousel模式)。另外，支持'auto'值，会根据容器container的宽度调整slides数目。
    centeredSlides: true, //设置slide居中
    spaceBetween: 20, // 每个item的间距，也可以用scss穿透实现
    coverflowEffect: {
      rotate: 0, //slide做3d旋转时Y轴的旋转角度。默认50。
      stretch: -10, //每个slide之间的拉伸值（距离），越大slide靠得越紧。 默认0。
      depth: 100, //slide的位置深度。值越大z轴距离越远，看起来越小。 默认100。
      modifier: 1, //depth和rotate和stretch的倍率，相当于 depth*modifier、rotate*modifier、stretch*modifier，值越大这三个参数的效果越明显。默认1。
      slideShadows: false, //开启slide阴影。默认 true。
    },
    observer: true, //修改swiper自己或子元素时，自动初始化swiper
    observeParents: true, //修改swiper的父元素时，自动初始化swiper
    observeSlideChildren: true,
    a11y: {
      prevSlideMessage: 'Previous slide',
      nextSlideMessage: 'Next slide',
    },

    ...props.option,
  };
});

/**
 * 主动跳转到指定页
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
    :modules="modules"
    :loop="swiperOptions.loop"
    :autoplay="swiperOptions.autoplay"
    @swiper="(Swiper) => (swiperObj = Swiper)"
    :navigation="swiperOptions.navigation"
    :speed="swiperOptions.speed"
    :spaceBetween="swiperOptions.spaceBetween"
    :coverflowEffect="swiperOptions.coverflowEffect"
    :centeredSlides="swiperOptions.centeredSlides"
    :slidesPerView="swiperOptions.slidesPerView"
    :mousewheel="swiperOptions.mousewheel"
    :observer="swiperOptions.observer"
    :observeParents="swiperOptions.observeParents"
    :observeSlideChildren="swiperOptions.observeSlideChildren"
    :centerInsufficientSlides="swiperOptions.centerInsufficientSlides"
  >
    <slot></slot>
  </swiper>
</template>

<style lang="scss" scoped></style>
