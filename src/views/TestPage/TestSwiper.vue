<script setup lang="ts">
import { reactive } from 'vue';
const nftList = reactive([
  {
    id: 1,
    text: '123123',
  },
  {
    id: 2,
    text: '66666',
  },
]);

// swiper nft卡
const slides = reactive({
  img1: null,
  img2: null,
});
</script>

<template>
  <BpSwiper>
    <swiper-slide :swiperRef="slides.img1" v-for="(nft, inx) in nftList" :key="inx">
      <div class="item-container">
        <div>{{ nft.id }}</div>
        <div>{{ nft.text }}</div>
      </div>
    </swiper-slide>
  </BpSwiper>
</template>

<style lang="scss" scoped></style>
