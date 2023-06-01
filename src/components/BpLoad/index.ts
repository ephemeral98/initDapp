import { createApp, h, watch } from 'vue';
import Loading from './index.vue';
import { loadStore, setLoad, setLoadStyle } from './useLoad';

/**
 * loading 组件
 */
const loadWrap = createApp({
  setup(props) {
    // console.log('load...props...', props);
  },
  render() {
    return h(Loading);
  },
});
// console.log('loadWrap...', loadWrap);
// 提供一个父元素
const parent = document.createElement('div');
//mount方法不再像vue2一样支持未挂载的实例，必须得挂载，即必须得给参数
const instance = loadWrap.mount(parent);

let lock = false; // 是不是首次加载

/**
 * 展示loading
 * @param {*} isShow 是否展示
 */
function installLoad({ isShow, style='' }) {
  setLoadStyle(style);
  if (isShow) {
    if (!lock) {
      document.body.appendChild(instance.$el);
      setLoad(true);
      lock = true;
    } else {
      // console.log('存在load...');
      // instance.$el.style.display = 'block';
      setLoad(true);
    }
  } else {
    if (lock) {
      // console.log('隐藏load...');
      setLoad(false);
    }
  }
}

watch(
  () => loadStore.loading,
  (newValue, oldValue) => {
    if (newValue) {
      instance.$el.style.display = 'block';
    } else {
      instance.$el.style.display = 'none';
    }
  }
);

export default installLoad;
