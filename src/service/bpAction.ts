// 所有交易的read 和 write 必须经过这两个方法
// 在各个class api 中调用写方法时候引用

import { ElMessage } from 'element-plus';
import i18n from '@/locales/i18n';
import { useAppStore } from '@/store/appStore';
import { getWalletReject } from '@/utils/tools';
const $t = i18n.global.t;

/**
 * 处理写交易动作,唤起交易之后的信息处理
 * @param {*} msgs 交易消息
 * @param {Function} func 交易函数
 * @param 交易参数
 * eg: bpWrite($t('base.9'), mintObj.value.funcName, 参数1, 参数2)
 *
 * 说明：true:默认消息  false:不需要消息; success还可以自定义消息
 * 一般使用默认：bpWrite(true, mintObj.value.funcName, 参数);
 */

interface IMsgs {
  success?: string | boolean; // 成功消息
  error?: boolean; // 不给错误消息
}

/**
 * 交易通讯状态
 */
interface ITransStatus {
  status: boolean; // 请求是否成功
  datas: any; // 请求的数据
  errorOrigin?: string; // 错误时候的消息(源)
  message?: string; // 错误时候的消息
}

export async function bpWrite(msgs: boolean | IMsgs, func, ...param): Promise<ITransStatus> {
  console.log('bpWrite入参: ', ...param);

  if (!func) {
    console.log('没有这个 write 方法！！，请查询方法名是否正确！');
    ElMessage.error('error');
    return {
      status: false,
      datas: '0',
    };
  }

  return func?.(...param)
    .then(async (resp) => {
      ElMessage({
        type: 'info',
        message: $t('base.10'),
      });
      const { events } = await resp?.wait?.();
      // 处理成功的消息

      // 不给成功提示(提示信息由调用者提供)
      const notCondiction = msgs === false || msgs?.['success'] === false;

      // 自定义成功的消息
      if (typeof msgs === 'object' && typeof msgs?.success === 'string') {
        ElMessage.success(msgs.success);
      } else if (notCondiction) {
      } else {
        // 给默认提示
        ElMessage.success('success');
      }

      return {
        status: true,
        datas: events,
      };
    })
    .catch((err) => {
      // console.log('bpWrite报错:', err);

      let info =
        err?.['reason'] || err?.data?.message || err?.error?.message || err?.message || err;

      // 点击了拒绝信息
      if (getWalletReject(err)) {
        info = 'User denied transaction';
      }

      // 避免信息太长看懵用户
      info = String(info).length > 200 ? 'error' : info;

      // 处理失败的消息

      // 不给默认提示
      const notMsgCondiction = msgs === false || msgs?.['error'] === false;

      if (!notMsgCondiction) {
        // 给失败的默认提示
        ElMessage.error(info);
      }

      return {
        status: false,
        datas: '0',
        errorOrigin: err,
        message: info,
      };
    });
}

/**
 * 处理读交易动作
 * @param {Function} func 交易函数
 * @param 交易参数
 * eg: bpRead(mintObj.value.funcName, 参数1, 参数2)
 */
export async function bpRead(func, ...param: any[]): Promise<ITransStatus> {
  if (!func) {
    return;
  }
  return await func?.(...param)
    .then((resp) => {
      return {
        status: true,
        datas: resp,
      };
    })
    .catch((err) => {
      if (useAppStore().defaultAccount) {
        // 没有连好小狐狸，报错了不提示
        console.log('bpRead...error...');
      }
      return {
        status: false,
        datas: '0',
        errorOrigin: err,
        message: err,
      };
    });
}
