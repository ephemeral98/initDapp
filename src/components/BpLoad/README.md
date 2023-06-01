# 指令转圈圈

## 使用方法

```jsx
const [doAuth, loadDoAuth] = useWrite(() => { await auth() });

<button v-load='loadDoAuth' @click="doAuth">点击授权</button>
```

自定义尺寸:

```jsx
<button v-load="[loadDoAuth, '50px']" @click="doAuth">点击授权</button>
```

使用暗色主题：
```jsx
<button v-load.dark="[loadDoAuth, '50px']" @click="doAuth">点击授权</button>
```



# 全局转圈圈

## 方式1. 按需导入使用(推荐)：

```js
import $load from '@cps/BpLoad/index';
$load({ isShow: true }); // 显示
$load({ isShow: false }); // 隐藏
```

## 方式2. 全局使用：

### 先导入

```js
// main.js
import BpLoading from '@cps/BpLoad/index';
const app = createApp(App);
app.config.globalProperties.$load = BpLoading;
```

#### 使用

```js
const gThis = getCurrentInstance().appContext.config.globalProperties;

gThis.$load({ isShow: true });
// await 一些列一部请求...
gThis.$load({ isShow: false });
```
