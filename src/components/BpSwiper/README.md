## 描述：

> 该组件是对swiper的二次封装，集合了一些基本的配置

### 使用方法：

```vue
// swiper nft卡
const slides = reactive({
  img1: null,
  img2: null,
});

<BpSwiper>
    <swiper-slide :swiperRef="slides.img1" v-for="(nft, inx) in nftList" :key="inx">
      <div class="item-container">文案...</div>
    </swiper-slide>
 </BpSwiper>
```



