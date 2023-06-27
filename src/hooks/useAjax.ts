import { reactive, ref, Ref, UnwrapRef, watch } from 'vue';
import { useAppStore } from '@store/appStore';
import axios from '@/service/request';

interface IAjaxEx<T> {
  loading: boolean; // 加载状态
  refresh: () => Promise<UnwrapRef<T>>; // 重新请求数据
  cancel: () => void; // 取消请求
}

export interface IAxiosResp<T> {
  code: string; // 请求结果状态码
  msg: string; // 消息
  success: boolean; // 是否成功
  data?: T; // 响应体数据
  [key: string]: any; // 允许传入其他属性
}

interface IOption<T, P> {
  params?: P; // 请求参数
  before?: (axios) => Promise<P>; // 请求之前
  after?: (resp: IAxiosResp<T>) => UnwrapRef<T>; // 请求之后
  wallet?: boolean; // 是否依赖钱包
  default: T; // 默认返回值
  immediate?: boolean; // 是否立即执行
  noLoadBlock?: boolean; // 转圈圈可以继续请求 (默认不可以)
}

/**
 * 基础请求
 * @param method 请求类型
 * @param url 请求地址
 * @param options 请求配置项
 */
function useBaseRequest<T, P>(
  method: string,
  url: string | Ref<string>,
  options: IOption<T, P>
): [Ref<any>, IAjaxEx<T>] {
  const appStore = useAppStore();
  let cancelTokenSource;

  /**
   * 返回状态结构
   */
  const result = reactive<IAjaxEx<T>>({
    loading: false,
    refresh,
    cancel,
  });

  const datas = ref<T>(options?.default); // 返回值
  /**
   * 重新请求(手动请求)
   */
  async function refresh(): Promise<UnwrapRef<T>> {
    return new Promise(async (resolve, reject) => {
      if (options.wallet) {
        watch(
          () => [appStore.defaultAccount],
          async () => {
            if (!+appStore.defaultAccount) {
              // 但是没有登录的，不发请求
              return;
            }
            const resp = await core();
            resolve(resp);
          },
          {
            immediate: true,
          }
        );
      } else {
        const resp = await core();
        resolve(resp);
      }
    });
  }

  /**
   * 取消请求
   */
  async function cancel() {
    cancelTokenSource?.cancel?.();
  }

  async function core(): Promise<UnwrapRef<T>> {
    if (result.loading && !options.noLoadBlock) return;

    if (options.noLoadBlock) {
      cancel(); // 如果转圈圈可以继续请求，则下次请求的时候，上次请求的数据已经没有意义了
    }
    cancelTokenSource = axios.CancelToken.source();

    result.loading = true;
    // 如果before有return，优先取before的
    const beforeResp = await options?.before?.(axios);
    let params = beforeResp || options.params;

    function request(method: string, payload): Promise<IAxiosResp<T>> {
      // 改写ref类型url
      const tempUrl = isRef(payload.url) ? payload.url.value : payload.url;

      // 改写参数
      const tempParams = isRef(payload.params) ? payload.params.value : payload.params;

      // 改写ref类型body数据
      for (const key in tempParams) {
        if (Object.prototype.hasOwnProperty.call(tempParams, key)) {
          const p = tempParams[key];
          if (isRef(p)) {
            tempParams[key] = p.value;
          }
        }
      }

      if (method === 'get' || method === 'delete') {
        return axios[method](tempUrl, {
          params: tempParams,
          cancelToken: cancelTokenSource.token,
        });
      } else {
        return axios[method](tempUrl, tempParams, {
          cancelToken: cancelTokenSource.token,
        });
      }
    }

    return await request(method, { url, params })
      .then(async (resp) => {
        datas.value = await options.after(resp);
        return datas.value;
      })
      .catch(async (err) => {
        datas.value = await options.after(err);
        return datas.value;
      })
      .finally(() => {
        result.loading = false;
      });
  }

  // 需要钱包的监听
  if (options?.wallet) {
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
        immediate: options?.immediate ?? false,
      }
    );
  } else {
    // 不需要钱包的监听
    if (options?.immediate === true) {
      // 立即执行
      core();
    } else {
    }
  }

  return [datas, result];
}

/**
 * get请求
 * @param url 请求地址
 * @param options 请求配置项
 */
export function useGet<T, P>(url: string | Ref<string>, options: IOption<T, P>): [Ref<T>, IAjaxEx<T>] {
  return useBaseRequest<T, P>('get', url, options);
}

/**
 * post请求
 * @param url 请求地址
 * @param options 请求配置项
 */
export function usePost<T, P>(url: string | Ref<string>, options: IOption<T, P>): [Ref<T>, IAjaxEx<T>] {
  return useBaseRequest<T, P>('post', url, options);
}

/**
 * put请求
 * @param url 请求地址
 * @param options 请求配置项
 */
export function usePut<T, P>(url: string | Ref<string>, options: IOption<T, P>): [Ref<T>, IAjaxEx<T>] {
  return useBaseRequest<T, P>('put', url, options);
}

/**
 * patch请求
 * @param url 请求地址
 * @param options 请求配置项
 */
export function usePatch<T, P>(
  url: string | Ref<string>,
  options: IOption<T, P>
): [Ref<any>, IAjaxEx<T>] {
  return useBaseRequest<T, P>('patch', url, options);
}

/**
 * delete请求
 * @param url 请求地址
 * @param options 请求配置项
 */
export function useDelete<T, P>(
  url: string | Ref<string>,
  options: IOption<T, P>
): [Ref<any>, IAjaxEx<T>] {
  return useBaseRequest<T, P>('delete', url, options);
}
