## 描述：

> 该组件是对swiper@8.3.2的二次封装，集合了一些基本的配置

### 使用方法：

```vue
const nftList = reactive([
  {
    id: 1,
    img: require('@img/holder.png'),
  },
  {
    id: 2,
    img: require('@img/holder.png'),
  },
  {
    id: 3,
    img: require('@img/holder.png'),
  },
]);


 <BpSwiper>
    <swiper-slide v-for="(nft, inx) in nftList" :key="inx">
      <div class="item-container"> {{ nft.id }} </div>
    </swiper-slide>
  </BpSwiper>
```

3D空间感轮播效果：

```js
// 属性加上这个
slidesPerView: 3, //设置slider容器能够同时显示的slides数量(carousel模式)。另外，支持'auto'值，会根据容器container的宽度调整slides数目。
```

```scss
  // swiper 穿透
  :deep(.swiper-container) {
    position: relative;
    @include -width-a(650);
    margin: 0.8rem auto;
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
      // height: 3.05rem;
      @include -height-a(405);
      /*  @media (min-width: 1920px) {
        height: vw(300);
      } */

      .item-img {
        cursor: pointer;
        @include -width-a(195);
        border-radius: 0.1rem;
      }
    }
  }
```

主动跳转到指定块：

```vue
const bpSwiper = ref(null);
<button @click="handleClick">click</button>
function handleClick() {
  bpSwiper.value.handleSlide(2); // 跳转到第二块
}

<BpSwiper :option="swiperOptions" ref="bpSwiper">
```

被动触发change事件

```vue
<BpSwiper :option="swiperOptions" @slideChange="handleChange">
```




