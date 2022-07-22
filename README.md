# initDapp

## 全局组件:

#### 1. BpButton

使用按钮的时候，与链上有交易的请求，统一使用全局组件```BpButton```，需要有加载状态```loading```。一些普通的操作DOM按钮可以不使用该组件。

```vue
const [handleClick, loadClick] = useWrite(async () => {
  await lpObj.claimAllReward();
});

<BpButton v-loading="loadClick" @click="handleClick" class="click-box">bp写操作</BpButton>
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

#### 写入时，借助```useWrite```:

记得里面是传入异步回调函数(async)

```js
const [handleClick, loadWrite] = useWrite(async () => {
  await lpObj.auth('0x00000');
});
```

如果需要返回值，需要借助外部变量

#### 读取时，借助useRead:

```js
const [checkInfo, checkInfoEX] = useRead(async () => {
  const p1 = mintCont.getBalance();
  const p2 = mintCont.getBalance();
  const p3 = mintCont.getBalance();

  const result = await Promise.all([p1, p2, p3]);
  return result; // 返回给checkInfo，无需再借助外部变量
});
```

checkInfo 是返回的数据，checkInfoEX 是返回的数据工具：loading，refetch、status 等



## bpAction

里面的```useRead```和```useWrite```方法，均在合约对象```contractsApi```文件夹里面的class调用，分别对应合约上的读和写。



## Tips:

#### useWrite, useRead 和 bpWrite, bpRead 的区别：

前者主要是各种拦截，以及loading的处理。不让调起钱包；

后者是对成功调起钱包交易的 后续信息处理;



## useStake

快速完成质押逻辑

如果推荐人是单独一个页面的，则把 推荐人(inv)的逻辑 删除


## 路由守卫：

可以在 routerHelp 文件中处理，如果链不对，弹窗还是message还是其他什么。。



## contractsApi

>  这个文件夹下面是放一些 合约api 的

#### 1. CoinToken: 一些符合 ERC20的代币，直接导入address和api，new 出一个代币对象

#### 2. LpToken: 一些 **通用** lp 币对对象，用法和 CoinToken 类似

#### 3. NftToken: 一些 **通用** nft 对象，用法和CoinToken类似

#### useDefaultRpc，每次构建对象的时候，在**createContract** 中，调用，获取预设的rpc，可参考 CoinToken

### 如果有其他合约，请自行创建对应的文件！！



## 注意

1. 所有合约方法，均放在 contractsApi 中，命名为: xxxContractApi
2. 不再使用```useRoute```获取路由信息，统一使用```useRouteTools```，



