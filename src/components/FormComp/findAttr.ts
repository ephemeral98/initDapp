/**
 * 寻找祖宗属性
 * @param ele DOM
 * @param attr 属性
 */
 export const findAttr = (ele, attr: string) => {
  if (ele.getAttribute(attr)) {
    return ele;
  }
  let parent = ele.parentElement;
  while (!!parent) {
    if (parent.getAttribute(attr)) {
      break;
    }
    parent = parent?.parentElement;
  }
  return parent;
};
