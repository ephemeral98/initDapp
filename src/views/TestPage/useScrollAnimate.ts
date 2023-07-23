// 获取dom的动画
interface IGetDomAnimate {
  (scrollStart: number, scrollEnd: number, dom: HTMLElement): {};
}

export default () => {
  const app = document.getElementById('app');

  const playgroundRef = ref<HTMLElement>(); // 主模块
  const listRef = ref<HTMLElement>(); // 列表模块
  const boxItemRef = reactive<HTMLElement[]>([]); // 子模块
  const setItemRef = (el) => {
    boxItemRef.push(el);
  };

  /**
   * 创建动画
   * @param scrollStart 滚动的开始位置
   * @param scrollEnd 滚动的结束位置
   * @param valueStart 动画的起始位置
   * @param valueEnd 动画的结束位置
   * @returns 返回一个函数，该函数接收滚动的位置，返回动画的位置
   */
  const createAnimate = (
    scrollStart: number,
    scrollEnd: number,
    valueStart: number,
    valueEnd: number
  ): ((scroll: number) => number) => {
    return (scroll: number) => {
      if (scroll < scrollStart) {
        return valueStart;
      }

      if (scroll > scrollEnd) {
        return valueEnd;
      }

      return (
        valueStart + ((valueEnd - valueStart) * (scroll - scrollStart)) / (scrollEnd - scrollStart)
      );
    };
  };

  /**
   * 更新动画
   */
  const updateAnimate = () => {
    const scroll = app.scrollTop;
    // 将当前滚动的位置，设置到对应的动画上
    for (const [dom, value] of animateMap) {
      for (const cssProps in value) {
        if (Object.prototype.hasOwnProperty.call(value, cssProps)) {
          dom.style[cssProps] = value[cssProps](scroll);
        }
      }
    }
  };

  /**
   * 获取dom的动画
   */
  const getDomAnimate: IGetDomAnimate = (
    scrollStart: number,
    scrollEnd: number,
    dom: HTMLElement
  ) => {
    // 获取当前dom的顺序 x 一个差值
    scrollStart += +dom.dataset.order * 150;

    // 计算每个item的偏移量
    const xOffset = listRef.value.clientWidth / 2 - dom.offsetLeft - dom.clientWidth / 2;
    const yOffset = listRef.value.clientHeight / 2 - dom.offsetTop - dom.clientHeight / 2;
    const xAnimate = createAnimate(scrollStart, scrollEnd, xOffset, 0);
    const yAnimate = createAnimate(scrollStart, scrollEnd, yOffset, 0);

    // 动画1
    const opacityAnimate = createAnimate(scrollStart, scrollEnd, 0, 1);
    const opacity = (scroll: number) => {
      return opacityAnimate(scroll);
    };

    // 动画2
    const scaleAnimate = createAnimate(scrollStart, scrollEnd, 0.5, 1);
    const transform = (scroll: number) => {
      return `translate(${xAnimate(scroll)}rem, ${yAnimate(scroll)}rem) scale(${scaleAnimate(
        scroll
      )})`;
    };

    return {
      opacity,
      transform,
    };
  };

  // 动画的列表：{ dom: {opacity: fn, transform: fn} }
  const animateMap = new Map();

  /**
   * 更新map里面的东西
   */
  const updateMap = () => {
    animateMap.clear();
    const playRect = playgroundRef.value.getBoundingClientRect(); // 获取主模块的矩形信息
    // 经过草稿画图可得
    const scrollStart = playRect.top + app.scrollTop; // 滚动的开始位置
    const scrollEnd = playRect.bottom + app.scrollTop - app.clientHeight; // 滚动的结束位置

    for (const item of boxItemRef) {
      animateMap.set(item, getDomAnimate(scrollStart, scrollEnd, item));
    }
  };

  return {
    updateMap,
    updateAnimate,
    playgroundRef,
    boxItemRef,
    setItemRef,
    listRef,
  };
};
