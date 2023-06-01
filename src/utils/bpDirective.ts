// 常用指令
// <input v-max="123" />   // 最大值
// <input v-min="123" />   // 最小值
// <input v-number />      // 数字
// <input v-double="3" />  // 小数
// <input v-double="-3" /> // 小数(包括负数)
// <input v-int />         // 整数
// <input v-integer />     // 整数(包括负数)

import { App, createApp, h } from 'vue';
import BpLoad from '@cps/BpLoad/BpLoadComp.vue';

/**
 * 限制输入框的最大值
 * eg: <input v-max="123" /> // 则输入框最大值不能超过123
 */
export const maxDirective = (app) => {
  const core = (el, binding) => {
    // 只能输入数字类型
    const reg = /(\-?\d+\.?\d*)|(\-?\d*\d*)/;
    el.value = el.value.match(reg)[0];

    if (el.value > binding.value) {
      el.value = binding.value;
      const e = new Event('input');
      el.dispatchEvent(e);
    }
  };

  let handleCore = () => {};

  app.directive('max', {
    mounted(el, binding, vnode) {
      // handleCore.bind(core, el, binding);
      handleCore = core.bind(this, el, binding);
      el.addEventListener('keyup', handleCore);
    },

    // 兼容异步数据
    updated(el, binding, vnode) {
      handleCore = core.bind(this, el, binding);
      el.addEventListener('keyup', handleCore);
    },
  });
};

/**
 * 限制输入框的最大值
 * eg: <input v-min="123" /> // 则输入框最小值不能小于123
 */
export const minDirective = (app) => {
  const core = (el, binding) => {
    // 只能输入数字类型
    const reg = /(\-?\d+\.?\d*)|(\-?\d*\d*)/;
    el.value = el.value.match(reg)[0];

    if (el.value < binding.value) {
      el.value = binding.value;
    }

    const e = new Event('input');
    el.dispatchEvent(e);
  };

  let handleCore = () => {};

  app.directive('min', {
    mounted(el, binding, vnode) {
      handleCore = core.bind(this, el, binding);
      el.removeEventListener('keyup', handleCore);
      el.addEventListener('keyup', handleCore);
    },

    // 兼容异步数据
    updated(el, binding, vnode) {
      handleCore = core.bind(this, el, binding);
      el.removeEventListener('keyup', handleCore);
      el.addEventListener('keyup', handleCore);
    },
  });
};

/**
 * 限制输入框只能输入 数字 类型
 * 兼容iOS type=number 不生效问题
 * eg: <input v-number />
 */
export const numberDirective = (app) => {
  app.directive('number', {
    mounted(el, binding, vnode) {
      const core = () => {
        // 只能输入数字类型
        const reg = /(\-?\d+\.?\d*)|(\-?\d*\d*)/;
        el.value = el.value.match(reg)[0];
        // vnode.props['onUpdate:modelValue'](666)
        const e = new Event('input');
        el.dispatchEvent(e);
      };

      el.addEventListener('keyup', core);
    },
  });
};

/**
 * 限制输入框输入 小数 类型
 * eg: <input v-double="2" /> // 限制2位小数
 * eg: <input v-double="-2" /> // 限制2位小数（可以为负数）
 */
export const doubleDirective = (app) => {
  app.directive('double', {
    mounted(el, binding, vnode) {
      const len = Math.abs(binding.value); // 限制的长度
      const core = () => {
        // let reg2 = new RegExp(`^\\D*(\\d*(?:\\.\\d{0,${binding.value}})?).*$`, 'g');
        // 只能输入数字类型
        const reg = binding.value > 0 ? /(\d+\.?\d*)|(\d*\d*)/ : /(\-?\d+\.?\d*)|(\-?\d*\d*)/;
        el.value = el.value.match(reg)?.[0];

        // 抹掉小数点后 n 位
        const regDot = /\.\d*/;
        const matcher = regDot.exec(el.value);

        if (matcher?.[0]?.length > len) {
          const dotInx = matcher.index; // 小数点出现的位置
          el.value = el.value?.slice(0, dotInx + len + 1);
        }

        const e = new Event('input');
        el.dispatchEvent(e);
      };

      el.addEventListener('keyup', core);
    },
  });
};

/**
 * 限制输入框只能输入 正整数 类型
 * eg: <input v-int />
 */
export const intDirective = (app) => {
  app.directive('int', {
    mounted(el, binding, vnode) {
      const core = () => {
        // 只能输入数字类型
        const reg = /(\d*)/;
        el.value = el.value.match(reg)?.[0];

        const e = new Event('input');
        el.dispatchEvent(e);
      };

      el.addEventListener('keyup', core);
    },
  });
};

/**
 * 限制输入框只能输入 整数(包括负数) 类型
 * eg: <input v-integer />
 */
export const integerDirective = (app) => {
  app.directive('integer', {
    mounted(el, binding, vnode) {
      const core = () => {
        // 只能输入数字类型
        const reg = /(\d*)/;
        el.value = el.value.match(reg)?.[0];

        const e = new Event('input');
        el.dispatchEvent(e);
      };

      el.addEventListener('keyup', core);
    },
  });
};

/**
 * 限制输入框只能输入 整数(包括负数) 类型
 * eg: <input v-integer />
 */
export const loadDirective = (app: App) => {
  /**
   * 获取新旧绑定状态值
   * @param binding
   * @returns
   */
  const getShowStatus = (binding) => {
    let oldShow, newShow;
    if (Array.isArray(binding.value)) {
      oldShow = binding.oldValue?.[0];
      newShow = binding.value[0];
    } else {
      oldShow = binding.oldValue;
      newShow = binding.value;
    }
    return { oldShow, newShow };
  };

  /**
   * 处理显示与隐藏
   * @param newShow 最新状态
   * @param el 目标元素
   */
  const handleShow = (newShow: boolean, el: HTMLElement) => {
    const pos = getComputedStyle(el).position;

    // 是否已经设置了定位
    const elPos = pos !== 'static' ? pos : 'relative';

    if (pos === 'static') {
      // 标记原始定位状态
      el.setAttribute('pos', pos);
    }

    // 判定目标位
    const wrap = el.querySelector('.bp-load-wrap');
    const wrapper = el.querySelector('.bp-load-wrapper');

    if (newShow) {
      // 展示(loading)
      el.classList.add(elPos);
      wrap.classList.remove('hidden');
      wrapper.classList.remove('hidden');
    } else {
      // 隐藏
      wrapper.classList.add('hidden');

      if (el.getAttribute('pos') === 'static') {
        el.classList.remove(elPos);
      }
    }
  };

  app.directive('load', {
    mounted(el, binding) {
      const theme = binding.modifiers.dark ? 'dark' : 'light';

      const { newShow } = getShowStatus(binding);

      let size = '30px'; // 默认30宽高
      // 可以传递数组设置宽高
      if (Array.isArray(binding.value)) {
        size = binding.value?.[1] ?? size;
      }

      const c = createApp({
        render() {
          return h(BpLoad, {
            class: `${theme}`,
            size,
          });
        },
      });

      // 添加一个元素作为最外层
      const wrapper = document.createElement('div');
      wrapper.className = 'bp-load-wrapper';
      wrapper.classList.add('hidden');
      wrapper.classList.add(theme);

      // 重新设置圆角
      const rounded = getComputedStyle(el).borderRadius;
      wrapper.style.borderRadius = rounded;

      // 阻止冒泡
      wrapper.addEventListener('click', (e) => {
        e.stopPropagation();
      });
      // 挂在并插入到目标元素上
      c.mount(wrapper);
      el.appendChild(wrapper);

      if (newShow) {
        handleShow(newShow, el);
      }
    },

    beforeUpdate(el, binding) {
      // 在指令的绑定值更新时，触发下一次更新
      const { oldShow, newShow } = getShowStatus(binding);

      if (oldShow !== newShow) {
        handleShow(newShow, el);
      }
    },
  });
};
