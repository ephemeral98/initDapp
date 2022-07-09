# initDapp

## 全局组件:

#### 1. BpButton

使用按钮的时候，统一使用全局组件```BpButton```，需要有加载状态```loading```

```vue
<BpButton class="click-box" @click="handleClick">bp写操作</BpButton>
```

#### 2. BpSwiper

轮播图，滑块等都可以使用...，基于 swiper@6.8.4 的二次封装

```vue
const slides = reactive({
  img1: null,
  img2: null,
});

 <BpSwiper>
    <swiper-slide :swiperRef="slides.img1" v-for="(nft, inx) in nftList" :key="inx">
      <div class="item-container"> {{ nft.id }} </div>
    </swiper-slide>
  </BpSwiper>
```

3D空间感轮播效果：

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



## useAction

写入时，借助```useWrite```:

记得里面是传入异步回调函数(async)

```js
const [handleClick, loadWrite] = useWrite(async () => {
  await lpContract.auth('0x00000');
});
```

如果需要返回值，需要借助外部变量

读取时，借助useRead:

```js
const [checkInfo, { datas: myBalan, loading }] = useRead(async () => {
  const p1 = mintCont.getBalance();
  const p2 = mintCont.getBalance();
  const p3 = mintCont.getBalance();

  const result = await Promise.all([p1, p2, p3]);
  return result; // 返回给myBalan，无需再借助外部变量
});
```



## bpAction

里面的```useRead```和```useWrite```方法，均在合约对象```contractsApi```文件夹里面的class调用，分别对应合约上的读和写。



## useStake

快速完成质押逻辑



## 路由守卫：

可以在 routerHelp 文件中处理，如果链不对，弹窗还是message还是其他什么。。



## 注意

1. 所有合约方法，均放在 contractsApi 中，命名为: xxxContractApi
2. 不再使用```useRoute```获取路由信息，统一使用```useRouteTools```，



