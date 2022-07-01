## 先导入
```js
// main.js
import BpLoading from './plugins/GlobalLoading/index';
const app = createApp(App);
app.config.globalProperties.$load = BpLoading;
```

## 使用
```js
const gThis = getCurrentInstance().appContext.config.globalProperties;

gThis.$load({isShow: true});
// await 一些列一部请求...
gThis.$load({isShow: false});
```
