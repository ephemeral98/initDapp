// 所有交易的read 和 write 必须经过这两个方法
// 在各个class api 中调用写方法时候引用

import { ElMessage } from 'element-plus';
import i18n from '@/locales/i18n';
const $t = i18n.global.t;

/**
 * 处理写交易动作,唤起交易之后的信息处理
 * @param {*} successMsg 交易成功的消息
 * @param {Function} func 交易函数
 * @param 交易参数
 * eg: bpWrite($t('msg.25'), this.mintObj.funcName, 参数1, 参数2)
 */
export async function bpWrite(successMsg, func, ...param) {
  console.log('...param', ...param);

  if (!func) {
    console.log('没有这个 write 方法！！，请查询方法名是否正确！');
    ElMessage.error('error');
    return;
  }

  return func?.(...param)
    .then(async (resp) => {
      ElMessage({
        type: 'info',
        message: $t('msg.8'),
      });
      const { events } = await resp?.wait?.();

      if (successMsg !== false) {
        // 需要成功提示
        ElMessage({
          type: 'success',
          message: successMsg || 'success',
        });
      }
      return {
        status: true,
        datas: events,
      };
    })
    .catch((err) => {
      console.log(err);
      let info = err?.['reason'] || err?.data?.message || err?.message;
      // 点击了拒绝信息
      if (info?.includes?.('User denied transaction')) {
        info = 'User denied transaction signature.';
      }

      // 避免信息太长看懵用户
      info = String(info).length > 100 ? 'error' : info;
      ElMessage({
        type: 'error',
        message: info,
      });
      return {
        status: true,
        datas: '0',
        message: err,
      };
    });
}

/**
 * 处理读交易动作
 * @param {Function} func 交易函数
 * @param 交易参数
 * eg: bpWrite(this.mintObj.funcName, 参数1, 参数2)
 */
export async function bpRead(func, ...param) {
  if (!func) {
    console.log('没有这个 read 方法！！，请查询方法名是否正确！');
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
      console.log(err);
      return {
        status: false,
        datas: '0',
        message: err,
      };
    });
}
