## 方式1. 按需导入使用(推荐)：

```js
import $load from '@cps/GlobalLoading/index';
$load({ isShow: true }); // 显示
$load({ isShow: false }); // 隐藏
```

## 方式2. 全局使用：

### 先导入

```js
// main.js
import BpLoading from '@cps/GlobalLoading/index';
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
