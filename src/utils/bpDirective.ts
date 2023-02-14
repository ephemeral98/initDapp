// 常用指令
// <input v-max="123" />   // 最大值
// <input v-min="123" />   // 最小值
// <input v-number />      // 数字
// <input v-double="3" />  // 小数
// <input v-double="-3" /> // 小数(包括负数)
// <input v-int />         // 整数
// <input v-integer />     // 整数(包括负数)

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
