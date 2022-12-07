import { ElMessage } from 'element-plus';
import { reactive, ref, Ref, watch } from 'vue';
import { useRouteItem } from '@/router/useRouterTools';
import { useAppStore } from '@store/appStore';
import i18n from '@/locales/i18n';
import { checkRightChain } from '@/router/routerHelp';
const $t = i18n.global.t;

interface IUseRead {
  loading: boolean; // 加载状态
  status: null | boolean; // 请求结果
  message: string; // 请求结果消息，如果成功，则为 '',
  refresh: () => Promise<void>; // 重新请求数据
  doCore: () => Promise<void>; // 手动请求方法
}

interface IEx {
  default: any; // 默认数据
  interval?: number; // 轮询 间隔时间
  watcher?: any; // 监听者 使用方式和 watch 一致
  immediate?: boolean; // 是否立即执行，默认立即
  noAccount?: boolean; // 是否 不依赖钱包
}

interface IAjax {
  loading: boolean; // 加载状态
  refresh: () => Promise<void>; // 重新请求数据
}

/**
 * 处理写的hook
 * @param func 回调函数
 * @returns
 * eg:
 *  const [forgive, loadForgive] = useWrite(async () => {
 *    const resp = await boxObj.directDepositIt(1);
 *  });
 */
export function useWrite(func): [any, Ref<boolean>] {
  const route = useRouteItem();
  const appStore = useAppStore();
  const loading = ref(false);
  async function help(...params) {
    if (loading.value) return;

    // 没有小狐狸插件，则跳去下载
    if (!window.ethereum) {
      window.open('https://metamask.io/download/');
      return;
    }

    // 链不对
    if (!appStore.rightChain) {
      // 提示
      ElMessage.error($t('msg.6'));

      // 弹窗
      loading.value = true;
      await appStore.switchChain(route.meta.needChains[0]);
      loading.value = false;
      return;
    }

    // 没有连接钱包
    if (!appStore.defaultAccount) {
      ElMessage.error($t('msg.7'));
      loading.value = true;
      await appStore.linkWallet();
      loading.value = false;
      return;
    }

    loading.value = true;
    const resp = await func(...params);
    loading.value = false;
    if (resp?.status === false) {
      // 返回报错信息
      return resp?.message;
    }
    // 请求成功，返回数据
    return resp;
  }

  return [help as any, loading];
}

/**
 * 处理读的hook
 * @param func 回调函数
 * @returns
 * tips: 如果是在 script 中使用返回值:checkInfo，记得要加上 .value
 * 
 * eg:
 *  const [checkInfo, checkInfoEX] = useRead(async () => {
      const p1 = lpContract.getBalance();
      const p2 = lpContract.getBalance();
      const result = await Promise.all([p1, p2]);
      return result; // 此时 checkInfo 会得到该返回值
    }); 
 * 
 */
export function useRead(func: () => Promise<any>, ex: IEx): [Ref<any>, IUseRead] {
  const appStore = useAppStore();

  const datas = ref(ex.default); // 返回值

  /**
   * core
   */
  async function core() {
    result.loading = true;
    const resp = await func();
    if (resp?.status === false) {
      // 返回报错信息
      result.message = resp?.message;
      result.status = false;
    } else {
      // 请求成功，返回数据
      datas.value = resp;
      result.status = true;
    }
    result.loading = false;
  }

  /**
   * 手动执行
   * 默认不依赖
   */
  async function doCore() {
    if (ex?.noAccount) {
      // 不依赖钱包
      core();
    } else {
      // 依赖钱包
      watch(
        () => [appStore.touchAfterWatchAccount],
        () => {
          if (!appStore.defaultAccount || !appStore.ethersObj.chainId || !appStore.netWorkReady)
            return;

          core();
        },
        {
          immediate: true,
        }
      );
    }
  }

  /**
   * 重新请求
   */
  async function refresh() {
    await core();
  }

  /**
   * 返回状态结构
   */
  const result = reactive<IUseRead>({
    loading: false,
    status: null,
    message: '',
    refresh,
    doCore,
  });

  if (ex?.immediate === false) {
    // 不立即执行
    watch(
      () => [appStore.touchRefreshRead],
      () => {
        core();
      }
    );
  } else {
    // 立即执行
    if (ex?.noAccount) {
      // 不依赖钱包
      core();
      watch(
        () => [appStore.touchRefreshRead],
        () => {
          core();
        }
      );
    } else {
      // 需要钱包地址
      watch(
        () => [appStore.touchAfterWatchAccount, appStore.touchRefreshRead],
        () => {
          core();
        }
      );
    }
  }

  // watcher
  if (ex?.watcher) {
    watch(ex.watcher, () => core());
  }

  // 轮询请求
  let timer;
  if (ex?.interval) {
    clearInterval(timer);
    timer = setInterval(() => {
      core();
    }, ex.interval);
  }

  return [datas, result];
}

/**
 * 监听账号，监听切链
 */
export function watchAccount(func: () => void): void {
  const appStore = useAppStore();

  watch(
    () => [appStore.defaultAccount, appStore.ethersObj.chainId, appStore.netWorkReady],
    (newVal, oldVal) => {
      if (!appStore.defaultAccount || !appStore.ethersObj.chainId || !appStore.netWorkReady) return;

      checkRightChain();
      func();

      nextTick(() => {
        // 确保合约对象构建完成后，才开始一些列的 read 方法
        // 由于 useRead 走的是任务队列，所以会等 所有 useHook构建完成合约对象 才会useRead
        appStore.setTouchAfterWatchAccount(appStore.touchAfterWatchAccount + 1);
      });
    },
    {
      immediate: true,
    }
  );
}

/* const [data, dataEx] = useAjax(async () => {
  const resp = await $get();
  const resp2 = await $get();
  return resp + resp2;
}); */
export function useAjax(
  func: () => Promise<any>,
  extra?: { watcher: boolean; default: any }
): [Ref<any>, IAjax] {
  const appStore = useAppStore();

  /**
   * 返回状态结构
   */
  const result = reactive<IAjax>({
    loading: false,
    refresh,
  });

  const datas = ref(extra.default); // 返回值
  /**
   * 重新请求
   */
  async function refresh() {
    await core();
  }

  async function core() {
    result.loading = true;
    const resp = await func().finally(() => {
      result.loading = false;
    });
    datas.value = resp;
  }

  // 需要钱包的监听
  if (extra?.watcher) {
    watch(
      () => [appStore.defaultAccount],
      () => {
        if (!+appStore.defaultAccount) {
          // 但是没有登录的，不发请求
          return;
        }
        core();
      },
      {
        immediate: true,
      }
    );
  } else {
    // 不需要钱包的监听
    core();
  }

  return [datas, result];
}
