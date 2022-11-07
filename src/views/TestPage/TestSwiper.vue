<script setup lang="ts">
import { Swiper, useSwiper } from 'swiper/vue';

const nftList = reactive([
  {
    id: 1,
    text: 'aaaaaaaa',
    img: require('@img/holder.png'),
  },
  {
    id: 2,
    text: 'bbbbbb',
    img: require('@img/holder.png'),
  },
  {
    id: 3,
    text: 'cccccc',
    img: require('@img/holder.png'),
  },
  {
    id: 4,
    text: 'ddddd',
    img: require('@img/holder.png'),
  },
  {
    id: 5,
    text: 'eeeeee',
    img: require('@img/holder.png'),
  },
]);

const swiperOptions = reactive({
  pagination: {
    el: '.swipers-pagination',
    clickable: true, // 开启分页器
  },

  navigation: {
    prevEl: '.game-nft-prev-btn',
    nextEl: '.game-nft-next-btn',
  },
});

function handleClick() {
  const swiperController = useSwiper();
  console.log('bpSwiper..', bpSwiper.value.handleSlide(2));
}

function handleChange() {
  console.log('改变了');
}

const bpSwiper = ref(null);
</script>

<template>
  <div class="test-swiper-wrapper">
    <BpSwiper
      :option="swiperOptions"
      ref="bpSwiper"
      @slideChange="handleChange"
    >
      <swiper-slide v-for="(nft, inx) in nftList" :key="inx">
        <div class="item-container">
          <img :src="nft.img" alt="" class="item-img" />
          <div>
            <div>{{ nft.id }}</div>
            <div>{{ nft.text }}</div>
          </div>
        </div>
      </swiper-slide>
      <div class="game-nft-next-btn arrow"></div>
      <div class="game-nft-prev-btn arrow"></div>
    </BpSwiper>
    <div class="swipers-pagination"></div>
  </div>

  <button @click="handleClick">主动跳转到指定页</button>
</template>

<style lang="scss" scoped>
.item-container {
  background-color: hotpink;
}

.arrow {
  width: 100px;
  height: 100px;
  background-color: #008c8c;
  margin: 0.1rem;
}

// swiper 穿透
:deep(.swiper) {
  position: relative;
  @include -width-a(650);
  margin: 0.8rem auto;
  background-color: skyblue;
  // min-height: 6.05rem;
  // background: yellow;

  .swiper-wrapper {
    align-items: center;
  }

  .swiper-slide {
    text-align: center;
    @include flexPos(center);
    opacity: 0.5;
  }
  .swiper-slide-active,
  .swiper-slide-duplicate-active {
    opacity: 1;

    .item-container {
      transform: scale(1.7);
      z-index: 99;
    }
  }

  .item-container {
    transition: 0.8s;
    @include flexPos(center);
    flex-direction: column;
    @include -height-a(405);

    .item-img {
      cursor: pointer;
      @include -width-a(195);
      border-radius: 0.1rem;
    }
  }
}
</style>
