// 常用指令
// <input v-max="123" />   // 最大值
// <input v-min="123" />   // 最小值
// <input v-number />      // 数字
// <input v-double="3" />  // 小数
// <input v-double="-3" /> // 小数(包括负数)
// <input v-int />         // 整数
// <input v-integer />     // 整数(包括负数)

// <button v-load="loadAuth" />
// <button v-disable="{message: '已经置灰', value: true}" />
// <img src="@img/home.png" v-img.lazy="require('@img/holder.png')"/>

import { App, createApp, h } from 'vue';
import BpLoad from '@cps/BpLoad/BpLoadComp.vue';
import { ElMessage } from 'element-plus';

/**
 * 限制输入框的最大值
 * eg: <input v-max="123" /> // 则输入框最大值不能超过123
 */
const maxDirective = (app) => {
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
const minDirective = (app) => {
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
const numberDirective = (app) => {
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
const doubleDirective = (app) => {
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
const intDirective = (app) => {
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
const integerDirective = (app) => {
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
 * 转圈圈
 * eg: <button v-load="loadAuth" />
 */
const loadDirective = (app: App) => {
  app.directive('load', {
    mounted(el, binding) {
      createLoad(el, binding);
      const { newShow } = getShowStatus(binding);

      newShow ? showMask(el) : hideMask(el);
    },

    beforeUpdate(el, binding) {
      // 在指令的绑定值更新时，触发下一次更新
      const { oldShow, newShow } = getShowStatus(binding);

      if (oldShow !== newShow) {
        newShow ? showMask(el) : hideMask(el);
      }
    },
  });

  /**
   * 创建转圈圈元素
   */
  const createLoad = (el: HTMLElement, binding) => {
    // 获取主题
    const theme = binding.modifiers.dark ? 'dark' : 'light';

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
    wrapper.classList.add(theme);

    // 获取元素样式
    const ELStyle = getComputedStyle(el);

    // 重新设置圆角
    const rounded = ELStyle.borderRadius;
    wrapper.style.borderRadius = rounded;

    // 阻止冒泡
    wrapper.addEventListener('click', (e) => {
      e.stopPropagation();
    });
    // 挂在并插入到目标元素上
    c.mount(wrapper);
    el.appendChild(wrapper);

    // 是否已经设置了定位
    if (ELStyle.position === 'static') {
      el.style.position = 'relative';
    }
  };

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
   * 显示
   * @param el 目标元素
   */
  const showMask = (el: HTMLElement) => {
    // 判定目标位
    const wrapper: HTMLElement = el.querySelector('.bp-load-wrapper');

    // 展示(loading)
    wrapper.style.display = 'block';
  };

  /**
   * 隐藏
   * @param el
   */
  const hideMask = (el: HTMLElement) => {
    const wrapper: HTMLElement = el.querySelector('.bp-load-wrapper');

    // 隐藏
    wrapper.style.display = 'none';
  };
};

/**
 * 置灰按钮
 * eg: <button v-disable="{message: '已经置灰', value: true}" />
 */
const disableDirective = (app: App) => {
  app.directive('disable', {
    mounted(el, binding, vnode) {
      createMask(el, binding);
      run(el, binding);
    },
    beforeUpdate(el, binding, vnode) {
      run(el, binding);
    },
  });

  /**
   * 计算当前需要置灰的项
   */
  const calcActiveItem = (binding) => {
    let activeItem;
    if (Array.isArray(binding.value)) {
      activeItem = binding.value.find((item) => item.value);
    } else if (Object.prototype.toString.call(binding.value) === '[object Object]') {
      activeItem = binding.value;
    } else {
      activeItem = binding.value ? { value: true } : null;
    }
    return activeItem;
  };

  /**
   * 执行
   * @param el
   * @param binding
   */
  const run = (el: HTMLElement, binding) => {
    const activeItem = calcActiveItem(binding);
    if (activeItem?.value) {
      showMask(el, binding);
    } else {
      hideMask(el, binding);
    }
  };

  /**
   * 创建遮罩层放在该元素的上方
   * @param el
   * @param binding
   */
  const createMask = (el: HTMLElement, binding) => {
    const mask = document.createElement('div');
    mask.style.position = 'absolute';
    mask.style.top = '0';
    mask.style.left = '0';
    mask.style.width = '100%';
    mask.style.height = '100%';
    mask.style.zIndex = '99999';
    mask.style.borderRadius = getComputedStyle(el).borderRadius;
    mask.classList.add('bp-disable-mask');

    const activeItem = calcActiveItem(binding);

    mask.addEventListener('click', (e) => {
      activeItem?.message && ElMessage.error(activeItem?.message);
      e.stopPropagation();
    });

    el.appendChild(mask);
    const pos = getComputedStyle(el).position;

    // 是否已经设置了定位
    if (pos === 'static') {
      el.style.position = 'relative';
    }
  };

  /**
   * 显示遮罩层
   * @param el
   */
  const showMask = (el: HTMLElement, binding) => {
    const maskDOM: HTMLElement = el.querySelector('.bp-disable-mask');
    if (binding.modifiers.dark) {
      el.style.filter = 'grayscale(98%)';
    }
    maskDOM && (maskDOM.style.display = 'block');
  };

  /**
   * 隐藏遮罩层
   * @param el
   */
  const hideMask = (el: HTMLElement, binding) => {
    const maskDOM: HTMLElement = el.querySelector('.bp-disable-mask');
    if (!maskDOM) return;
    el.style.filter = 'none';
    maskDOM && (maskDOM.style.display = 'none');
  };
};

/**
 * 图片懒加载
 * eg: <img src="@img/home.png" v-img.lazy="require('@img/holder.png')"/>
 * eg: <img src="@img/home.png" v-img.backup="[require('@img/holder.png')]" />
 */
const imgDirective = (app: App) => {
  /**
   * 加载图片资源
   */
  function fetchImg(url) {
    return new Promise((resolve, reject) => {
      const bgImg = new Image();
      bgImg.src = url;
      // 图片加载成功
      bgImg.onload = () => {
        resolve(url);
      };
      // 图片加载失败
      bgImg.onerror = () => {
        reject(url);
      };
    });
  }

  app.directive('img', {
    mounted(el, binding, vnode) {
      const originSrc = el.src;

      // 懒加载
      if (binding.modifiers.lazy) {
        // 开头瞬间换成lazySrc
        el.src = binding.value;
        // 等待图片加载完成后，偷偷替换回来
        fetchImg(originSrc).then(() => {
          el.src = originSrc;
        });
      }

      // 备用重复请求
      if (binding.modifiers.backup) {
        if (Array.isArray(binding.value)) {
          let len = 0;
          const maxLen = binding.value.length;
          const handleFetchImg = (originSrc) => {
            if (len < maxLen) {
              fetchImg(binding.value[len])
                .then((respSrc) => {
                  el.src = respSrc;
                })
                .catch(() => {
                  len++;
                  handleFetchImg(originSrc);
                });
            }
          };

          el.addEventListener('error', () => {
            handleFetchImg(originSrc);
          });
        }

        if (typeof binding.value === 'number') {
          let count = binding.value;

          /**
           * 偷偷请求资源
           */
          const handleFetchImg = (originSrc) => {
            if (count > 0) {
              count--;

              fetchImg(originSrc)
                .then((respSrc) => {
                  el.src = respSrc;
                })
                .catch(() => {
                  handleFetchImg(originSrc);
                });
            }
          };

          el.addEventListener('error', () => {
            handleFetchImg(originSrc);
          });
        }
      }
    },
  });
};

/**
 * 安装指令
 * @param app
 */
const install = (app: App) => {
  doubleDirective(app);
  intDirective(app);
  integerDirective(app);
  loadDirective(app);
  disableDirective(app);
  maxDirective(app);
  minDirective(app);
  numberDirective(app);
  imgDirective(app);
};

export default {
  install,
};
