## 描述：

> 该组件没有什么很大的封装，一些样式等，还是交给调用者

## 作用：

1. 主要是显示没有连接对的链的话，就显示连接文案.
2. 置灰显示

### 使用方法：

```vue
const isDisable = ref(false); // 是否置灰按钮
<BpButton class="blue-btn" @click="func" :disable="isDisable">点击</BpButton>
```

