import { ElMessage } from 'element-plus';
import { reactive, ref, Ref, UnwrapRef, watch } from 'vue';
import { useRouteItem } from '@/router/useRouterTools';
import { useAppStore } from '@store/appStore';
import i18n from '@/locales/i18n';
import { checkRightChain } from '@/router/routerHelp';
import { clone } from '@/utils/tools';

const $t = i18n.global.t;

interface IUseRead<T> {
  loading: boolean; // 加载状态
  status: null | boolean; // 请求结果
  message: string; // 请求结果消息，如果成功，则为 '',
  refresh: (e?) => Promise<T>; // 重新请求数据
  cancel: () => void; // 取消请求
  execute: () => Promise<T>; // 执行请求
  stopInterval: () => void; // 停止轮询(如果设置了interval)
}

interface IEx<T> {
  default: T; // 默认数据
  interval?: number; // 轮询 间隔时间
  watcher?: any; // 监听者 使用方式和 watch 一致
  immediate?: boolean; // 是否立即执行，默认立即
  noAccount?: boolean; // 是否 不依赖钱包
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
export function useWrite(
  func: (...params) => Promise<void>
): [(...params) => Promise<void>, Ref<boolean>] {
  const route = useRouteItem();
  const appStore = useAppStore();
  const loading = ref(false);
  async function run(...params) {
    if (loading.value) return;

    // 没有小狐狸插件，则跳去下载
    if (!window.ethereum) {
      window.open('https://metamask.io/download/');
      return;
    }

    // 链不对
    if (!appStore.rightChain) {
      // 提示
      ElMessage.error($t('base.8'));

      // 弹窗
      loading.value = true;
      await appStore.switchChain(route.meta.needChains[0]);
      loading.value = false;
      return;
    }

    // 没有连接钱包
    if (!appStore.defaultAccount) {
      ElMessage.error($t('base.16'));
      loading.value = true;
      await appStore.linkWallet();
      loading.value = false;
      return;
    }

    loading.value = true;
    await func(...params);
    loading.value = false;
  }

  return [run, loading];
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
export function useRead<T>(func: (e?) => Promise<T>, ex: IEx<T>): [Ref<UnwrapRef<T>>, IUseRead<T>] {
  const appStore = useAppStore();
  const datas = ref<T>(ex.default); // 返回值

  // 该作用域共享这个取消请求的信号
  let currentController: AbortController, signal: AbortSignal;

  /**
   * 产生取消请求的信号
   */
  function createCancelSignal() {
    const controller = new AbortController();
    currentController = controller;
    signal = controller.signal;
  }

  /**
   * 取消请求封装体
   * @param p1
   * @param signal
   * @param controller
   * @returns
   */
  async function aborter(p1: Promise<any>) {
    createCancelSignal();

    const p2 = new Promise((resolve, reject) => {
      /**
       * 定一个失败的Promise
       */
      function cancelPromise() {
        signal.removeEventListener('abort', cancelPromise);
        return reject('取消成功');
      }
      // 监听取消的状态
      if (signal) {
        signal.addEventListener('abort', cancelPromise);
      }
    });

    return await Promise.race([p1, p2]);
  }

  /**
   * 取消请求
   */
  const cancel = () => {
    currentController?.abort?.();
  };

  /**
   * 返回状态结构
   */
  const result = reactive<IUseRead<T>>({
    loading: false,
    status: null,
    message: '',
    refresh,
    cancel,
    execute,
    stopInterval: () => {},
  });

  /**
   * core
   */
  async function core(e?) {
    cancel();
    result.loading = true;
    const req = aborter(func(e));
    const resp = await req.catch((err) => {
      console.log(err);
      return false;
    });

    result.loading = false;

    if (!resp) return resp;

    if (resp?.status === false) {
      // 请求失败，返回报错信息
      result.message = resp?.message;
      result.status = false;
    } else {
      // 请求成功，返回数据
      datas.value = clone(resp, true);
      result.status = true;
    }
    return resp;
  }

  /**
   * 手动执行
   * @param e
   */
  async function execute(e?): Promise<T> {
    return new Promise((resolve, reject) => {
      if (ex?.noAccount) {
        // 不依赖钱包
        core(e)
          .then(async (resp) => {
            resolve(resp);
          })
          .catch((err) => {
            resolve(err);
          });
      } else {
        // 依赖钱包
        watch(
          () => [appStore.defaultAccount, appStore.ethersObj.chainId, appStore.netWorkReady],
          () => {
            if (!appStore.defaultAccount || !appStore.ethersObj.chainId || !appStore.netWorkReady)
              return;

            core(e)
              .then(async (resp) => {
                resolve(resp);
              })
              .catch((err) => {
                resolve(err);
              });
          },
          {
            immediate: true,
          }
        );
      }
    });
  }

  /**
   * 单纯重新请求
   */
  async function refresh(e?): Promise<T> {
    return new Promise((resolve, reject) => {
      core(e)
        .then(async (resp) => {
          resolve(resp);
        })
        .catch((err) => {
          resolve(err);
        });
    });
  }

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
        () => [
          appStore.defaultAccount,
          appStore.ethersObj.chainId,
          appStore.netWorkReady,
          appStore.touchRefreshRead,
        ],
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
    result.stopInterval = () => {
      clearInterval(timer);
    };
  }

  onBeforeUnmount(() => {
    timer && clearInterval(timer);
  });

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
