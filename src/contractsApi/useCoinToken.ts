// 代币 对象信息

// import { useAppStore } from '@store/appStore';
import { ethers } from 'ethers';
import { useAppStore } from '@/store/appStore';
import { IAddressObj } from './types';
import i18n from '@/locales/i18n';
import { bpFormat, bpGt, bpMul } from '@/utils/bpMath';
import { bpRead, bpWrite } from '@/service/bpAction';
import useDefaultRpc from './useDefaultRpc';
import { reactive, Ref, ref } from 'vue';
import { watchAccount } from '@/hooks/useAction';
import { sleep } from '@/utils/tools';

const $t = i18n.global.t;

export default (addressObj: IAddressObj) => {
  const appStore = useAppStore();
  const created = ref(false); // 合约对象是否构建完
  const coinObj = ref<any>({});
  const decimals = ref<number>(18);

  /**
   * 构建代币对象
   * @param {Object} addressObj：包括合约地址、abi
   * 例如 去旁边的 address.js 里拿 BVG_TOKEN_CONT 传入
   * @returns 代币的信息
   */
  async function createContract(addressObj) {
    await sleep(3000);

    const signer = useDefaultRpc();
    try {
      coinObj.value = new ethers.Contract(addressObj.address, addressObj.abi, signer);
    } catch (error) {
      console.log('构建CoinToken合约对象失败...');
    }
    created.value = true;
    return coinObj;
  }
  createContract(addressObj);

  watchAccount(() => {
    createContract(addressObj);
  });

  // 代币精度
  const decimalsObj = ref<number>(18);
  /**
   * 获取该代币精度
   */
  async function getDecimals(): Promise<Ref> {
    const { datas, status } = await bpRead(coinObj.value.decimals);
    if (!status) console.log('getDecimals...error...');
    decimalsObj.value = datas || 18;
    return decimalsObj;
  }

  // 代币余额
  const balanceObj = reactive({
    balanceOrigin: '0',
    balanceShow: '0',
  });
  /**
   * 获取代币余额（带精度）
   * @param digi 约为几位小数
   */
  async function getBalance(digi: number = 2) {
    if (!decimals.value) {
      await getDecimals();
    }
    const { status, datas } =
      (await bpRead(coinObj.value.balanceOf, appStore.defaultAccount)) || {};
    if (!status) console.log('getBalance...error...');

    balanceObj.balanceOrigin = status ? datas : '0';
    balanceObj.balanceShow = status ? bpFormat(datas, -digi, decimals.value) : '0';

    return balanceObj;
  }

  // 获取totalSupply
  const totalSupplyObj = reactive({
    totalSupplyOrigin: '0',
    totalSupplyShow: '0',
  });
  /**
   * 获取totalSupply
   * @param digi 约为几位小数
   */
  async function totalSupply(digi: number = 2) {
    const { status, datas } = await bpRead(coinObj.value.totalSupply);
    if (!status) console.log('totalSupply...error...');

    totalSupplyObj.totalSupplyOrigin = status ? datas : '0';
    totalSupplyObj.totalSupplyShow = status ? bpFormat(datas, -digi, decimals.value) : '0';

    return totalSupplyObj;
  }

  // 是否授权
  const hasAllow = ref(false);
  /**
   * 判断是否授权
   * @param {String} hoster 托管给谁
   * @returns {Boolean} true 已经授权，false 没有授权
   */
  async function allow(hoster: string) {
    console.log('coinObj.value...', coinObj.value);
    const allowance =
      (await bpRead(coinObj.value.allowance, appStore.defaultAccount, hoster)) || {};
    console.log('allowance....', allowance);
    const balance = getBalance() || {};
    const [{ status, datas }, { balanceOrigin }] = (await Promise.all([allowance, balance])) as any;

    if (!status) {
      console.log('allow...error...');
      return false;
    }

    hasAllow.value = bpGt(datas, balanceOrigin);
    return hasAllow;
  }

  /**
   * 授权
   * @param {String} hoster 托管给谁
   */
  async function auth(hoster: string) {
    const { status } = await bpWrite(
      $t('msg.3'),
      coinObj.value.approve,
      hoster,
      ethers.constants.MaxUint256
    );
    return status;
  }

  /**
   * 主动转账
   * @param recipient 接收者
   * @param amount 数额
   */
  async function transfer(recipient: string, amount) {
    if (!decimals.value) {
      await getDecimals();
    }
    const cloneAmount = bpMul(amount, 10 ** decimals.value);
    const { status } = await bpWrite($t('msg.5'), coinObj.value.transfer, recipient, cloneAmount);
    return status;
  }

  /**
   * 被动转账
   * @param sender 转账者
   * @param recipient 接收者
   * @param amount 数额
   * @returns
   */
  async function transferFrom(sender: string, recipient: string, amount) {
    if (!decimals.value) {
      await getDecimals();
    }
    const cloneAmount = bpMul(amount, 10 ** decimals.value);
    const { status } = await bpWrite(
      $t('msg.5'),
      coinObj.value.transferFrom,
      sender,
      recipient,
      cloneAmount
    );
    if (!status) console.log('transferFrom...error...');

    return status;
  }

  return {
    created,
    decimalsObj,
    balanceObj,
    totalSupplyObj,
    hasAllow,
    createContract,
    getDecimals,
    getBalance,
    totalSupply,
    allow,
    auth,
    transfer,
    transferFrom,
  };
};