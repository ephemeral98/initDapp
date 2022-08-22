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

轮播图，滑块等都可以使用...，基于 swiper@8.3.2 的二次封装



#### 3. BpForm

包括 ```<bp-input>```，```<Bp-add>```，```<bp-sub>```



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

> checkInfo 是返回的数据，checkInfoEX 是返回的数据工具：loading，refetch、status 等



| 名字    | 类型     | 描述                                      |
| ------- | -------- | ----------------------------------------- |
| loading | boolean  | 加载中                                    |
| refetch | function | 是否重新请求数据(重刷)                    |
| status  | boolean  | 状态，true表示请求成功，false表示请求失败 |



**PS:**

当用异步调用 hook 的时候，该 hook 的所有方法要使用 ```{watcher: created}```，例：

```js
async function createContract(addressObj) {
    await sleep(3000); // 某某情况这里用了await
    
    const signer = useDefaultRpc();
    coinObj.value = new ethers.Contract(addressObj.address, addressObj.abi, signer);

    created.value = true;
    return coinObj;
  }

```

```js
const [datas, dataEx] = useRead(
  async () => {
    const resp = await allow('0x6BDb16fDC24679E9dE0A4FF9aDc7A7C36831Cc21'),
    return resp;
  },
  { watcher: created }  // 上面用了 await 去构建合约对象，这里要用这个
);
```





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

#### 1. useCoinToken: 一些符合 ERC20的代币，直接导入address和api

#### 2. useLpToken: 一些 **通用** lp 币对对象，用法和 useCoinToken 类似

#### 3. useNftToken: 一些 **通用** nft 对象，用法和useCoinToken类似

#### useDefaultRpc，每次构建对象的时候，在**createContract** 中，调用，获取预设的rpc，可参考 useCoinToken

### 如果有其他合约，请自行创建对应的文件！！



## 注意

1. 所有合约方法，均放在 contractsApi 中，命名为: xxxContractApi
2. 不再使用```useRoute```获取路由信息，统一使用```useRouteTools```，


## PS:
由于 vite 使用 js 的 debugger 的时候，总是跳到不准确的地方，所以建议使用 vsCode 打断点：

```
{
  // 使用 IntelliSense 了解相关属性。 
  // 悬停以查看现有属性的描述。
  // 欲了解更多信息，请访问: https://go.microsoft.com/fwlink/?linkid=830387
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Launch Edge",
      "request": "launch",
      "type": "chrome",
      "url": "http://localhost:3100", // 写自己的端口号
      "webRoot": "${workspaceFolder}/src",
    },
  ]
}

```





