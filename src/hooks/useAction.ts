import { ElMessage } from 'element-plus';
import { reactive, ref, Ref, watch } from 'vue';
import { useRouteItem } from '@/router/useRouterTools';
import { useAppStore } from '@store/appStore';
import i18n from '@/locales/i18n';
import { ITransStatus } from '@/service/bpAction';
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

/**
 * 处理读的hook
 * @param func 回调函数
 * @returns
 * tips: 如果是在 script 中使用返回值:datas，记得要加上 .value
 * 
 * eg:
 *  const [checkInfo, { datas: myBalan, loading }] = useRead(async () => {
      const p1 = lpContract.getBalance();
      const p2 = lpContract.getBalance();
      const result = await Promise.all([p1, p2]);
      return result; // 此时 myBalan 会得到该返回值
    }); 
 * 
 */
export function useRead(func): [Function, { datas: Ref<any>; loading: Ref<boolean> }] {
  const datas = ref(null); // 返回值
  const loading = ref(false); // 加载状态

  async function help(...params) {
    // if (loading.value) return; // read不同于write,允许频繁调用

    loading.value = true;
    const resp = await func(...params);

    if (resp?.status === false) {
      // 返回报错信息
      datas.value = resp?.message;
      loading.value = false;
      return datas.message;
    } else {
      // 请求成功，返回数据
      datas.value = resp;
      loading.value = false;
      return resp;
    }
  }

  return [help as any, { datas, loading }];
}

interface IUseRead {
  loading: boolean; // 加载中
  refetch: () => void; // 重新请求数据
  status: null | boolean; // 请求结果
  message: string; // 请求结果消息，如果成功，则为 '',
}

interface IEx {
  interval?: number;
  watcher?: number;
}

export function useLayRead(func: () => Promise<ITransStatus>, ex?: IEx): [Ref<any>, IUseRead] {
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
    } else {
      // 请求成功，返回数据
      datas.value = resp;
    }
    result.loading = false;
    result.status = resp.status;
  }

  watch(
    () => refetchStatus.value,
    async () => {
      help();
    }
  );

  return [datas, result];
}
