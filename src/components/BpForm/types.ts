import { Ref } from 'vue';

// 输入框的值
export interface IVal {
  show: Ref<string> | string; // 展示数据
  origin: any; // 传参数据
}
