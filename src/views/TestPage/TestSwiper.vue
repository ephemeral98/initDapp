<template>
  <swiper
    :modules="modules"
    :pagination="{ clickable: true }"
    :autoplay="autoplayOptions"
    @swiper="onSwiper"
    @slideChange="onSlideChange"
  >
    <swiper-slide>1</swiper-slide>
    <swiper-slide>2</swiper-slide>
    <swiper-slide>3</swiper-slide>
  </swiper>
</template>
 
<script lang="ts" setup>
//这里就是更新后的路径，以前是import { Swiper, SwiperSlide } from 'swiper/vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
 
 
import { Pagination, A11y, Autoplay } from 'swiper'
 
//这里就是更新后的路径，以前是import 'swiper/css'
// import 'swiper/swiper.min.css'
 
//自动轮播的配置
const autoplayOptions = {
  delay: 500,
  disableOnInteraction: false,
  loop: false,
  pauseOnMouseEnter: true,
  reverseDirection: true
}
 
const onSwiper = (swiper: any) => {
  console.log(swiper)
}
const onSlideChange = (e) => {
  // swiper切换的时候执行的方法
  console.log('slide change', e.activeIndex)
}
const modules = [Pagination, A11y, Autoplay]
</script>
<style lang="scss" scoped>
.swiper {
  .swiper-slide {
    height: 200px;
  }
}
</style>
