import { reactive, readonly } from '@vue/reactivity';

const state = reactive({
  loading: false,
  style: '',
});

const loadStore = readonly(state);

/**
 * 控制loading显示隐藏
 * @param {Boolean} payload 控制loading显示隐藏
 */
function setLoad(payload) {
  state.loading = payload;
}

/**
 * 控制loading样式类型
 * @param Strying payload 控制loading样式类型
 */
 function setLoadStyle(payload) {
  state.style = payload;
}

export { loadStore, setLoad, setLoadStyle };
