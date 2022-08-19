import { ElMessage } from 'element-plus';
import { reactive, ReactiveEffect, ref, Ref, watch } from 'vue';
import { useRouteItem } from '@/router/useRouterTools';
import { useAppStore } from '@store/appStore';
import i18n from '@/locales/i18n';
import { ITransStatus } from '@/service/bpAction';
import { checkRightChain } from '@/router/routerHelp';
const $t = i18n.global.t;

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

interface IUseRead {
  loading: boolean; // 加载中
  refetch: () => void; // 重新请求数据
  status: null | boolean; // 请求结果
  message: string; // 请求结果消息，如果成功，则为 '',
}

interface IEx {
  interval?: number; // 轮询 间隔时间
  watcher?: any; // 监听者 使用方式和 watch 一致
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
export function useRead(func: () => Promise<any>, ex?: IEx): [Ref<any>, IUseRead] {
  const appStore = useAppStore();

  const datas = ref({}); // 返回值
  const refetchStatus = ref(false);
  /**
   * 重新请求
   */
  function refetch() {
    refetchStatus.value = !refetchStatus.value;
  }

  /**
   * 返回状态结构
   */
  const result = reactive<IUseRead>({
    loading: false,
    refetch,
    status: null,
    message: '',
  });

  async function help() {
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

  // refetch
  watch(
    () => [refetchStatus.value, appStore.defaultAccount, appStore.ethersObj.chainId],
    () => help(),
    {
      immediate: true,
    }
  );

  // watcher
  if (ex?.watcher) {
    watch(ex.watcher, () => help());
  }

  // 轮询请求
  let timer;
  if (ex?.interval) {
    clearInterval(timer);
    timer = setInterval(() => {
      help();
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
    () => [appStore.defaultAccount, appStore.ethersObj.chainId],
    (newVal, oldVal) => {
      if (!appStore.defaultAccount || !appStore.ethersObj.chainId) return;
      // checkRightChain(); // 这里不需要重新检查，因为App.vue已经有检测了
      func();
    }
  );
}
