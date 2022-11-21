// 开始~结束
// 0~4
// 5~9
// 10~15

// eg:
// const { curPage, loading, finished, finalData: showData, core: init } = useDiviPage(dataWrap);
// init();

import { $GET } from '@/service/request';
import { useScrollBottom } from './useScrollCallback';

const testBaseGet = 'https://vkmarkets.net/api/user/info';

/**
 * 分页hook
 * @param limit 每页限制多少条数据
 */
const useDiviPage = (dataWrap, limit: number = 5) => {
  const curPage = ref(1); // 当前的页码

  const loading = ref(false); // 是否请求中
  const finished = ref(false); // 是否拿到了所有数据

  const finalData: any = ref([]); // 最终的数据

  // 开始 index
  const beginPage = computed(() => {
    return limit * (curPage.value - 1);
  });

  // 结束 index
  const endPage = computed(() => {
    return limit * curPage.value - 1;
  });

  function core() {
    loading.value = true;
    const resp = dataWrap
      .filter((item, inx) => {
        return inx >= beginPage.value && inx <= endPage.value;
      })
      .map(async (item) => {
        console.log('当前', item);
        const resp: any = await $GET(testBaseGet + '/' + item.address);
        console.log('请求的结果', resp);
        item.commoditys = resp.data;
        return item;
      });

    Promise.allSettled(resp).then((result) => {
      const res = result.map((it: any) => it.value);
      finalData.value.push(...res);

      loading.value = false;
    });
  }

  useScrollBottom(() => {
    if (dataWrap.length > finalData.value.length) {
      curPage.value++;
      loading.value = true;
      core();
    } else {
      finished.value = true;
    }
  });

  return {
    curPage,
    loading,
    finished,
    finalData,
    core,
  };
};

export default useDiviPage;
