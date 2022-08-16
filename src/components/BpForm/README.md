## 描述：

> 该组件组是对输入框和加减按钮的限制，挂载于全局

### bp-input

> 输入框限制，处理用户输入数字

### 使用方法：

```vue
const inpValue = ref('');
<bp-input :max="666" v-model:value="inpValue" />
```

| 属性  | 描述                                                      | 类型           | 默认 |
| ----- | --------------------------------------------------------- | -------------- | ---- |
| max   | 最大值，输入上限，超过最大值则取最大值                    | number、string | 无   |
| type  | 表示类型: 只能是: int、double，(double.3表示小数后约几位) | string         | int  |
| value | 处理值，可用 v-model 代替                                 | number、string | 无   |



### bp-add

> 加法按钮限制

### 使用方法：

```vue
const inpValue = ref('');
<bp-add :max="666" v-model:value="inpValue" />
```

| 属性  | 描述                                   | 类型           | 默认 |
| ----- | -------------------------------------- | -------------- | ---- |
| max   | 最大值，输入上限，超过最大值则取最大值 | number、string | 无   |
| value | 处理值，可用 v-model 代替              | number、string | 无   |



### bp-sub

> 减法按钮限制

### 使用方法：

```vue
const inpValue = ref('');
<bp-sub :min="1" v-model:value="inpValue" />
```

| 属性  | 描述                                   | 类型           | 默认 |
| ----- | -------------------------------------- | -------------- | ---- |
| min   | 最大值，输入上限，超过最大值则取最大值 | number、string | 0    |
| value | 处理值，可用 v-model 代替              | number、string | 无   |

