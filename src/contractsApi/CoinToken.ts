// 代币 对象信息

// import { useAppStore } from '@store/appStore';
import { ethers } from 'ethers';
import { useAppStore } from '@/store/appStore';
import { toRaw } from 'vue';
import { IAddressObj } from './types';
import i18n from '@/locales/i18n';
import { bpFormat, bpGt, bpMul } from '@/utils/bpMath';
import { bpRead, bpWrite } from '@/service/bpAction';
import useDefaultRpc from './useDefaultRpc';
const $t = i18n.global.t;

export default class {
  public coinObj; // 代币合约对象
  public decimals; // 精度
  public balance; // 余额
  public defaultAccount; // 用户钱包地址

  /**
   * 构建
   * @param {Object} addressObj 包括合约地址、abi
   */
  constructor(addressObj: IAddressObj) {
    const appStore = useAppStore();
    const account = appStore.defaultAccount;
    this.createContract(addressObj);
    this.defaultAccount = account;
  }

  /**
   * 构建代币对象
   * @param {Object} addressObj：包括合约地址、abi
   * 例如 去旁边的 address.js 里拿 BVG_TOKEN_CONT 传入
   * @returns 代币的信息
   */
  createContract(addressObj) {
    const signer = useDefaultRpc();

    try {
      const coinObj = new ethers.Contract(addressObj.address, addressObj.abi, signer);
      this.coinObj = coinObj;
    } catch (error) {
      console.log('构建CoinToken合约对象失败...');
    }
    return this.coinObj;
  }

  /**
   * 获取该代币精度
   * @returns {Number} 精度
   */
  async getDecimals() {
    const { datas } = await bpRead(this.coinObj.decimals);
    this.decimals = datas;
    return this.decimals || 18;
  }

  /**
   * 获取代币余额（带精度）
   * @param digi 约为几位小数
   */
  async getBalance(digi: number = 2) {
    if (!this.decimals) {
      this.decimals = await this.getDecimals();
    }
    const { status, datas } = (await bpRead(this.coinObj.balanceOf, this.defaultAccount)) || {};
    return {
      balanceOrigin: status ? datas : '0',
      balanceShow: status ? bpFormat(datas, -digi, this.decimals) : '0',
    };
  }

  /**
   * 获取totalSupply
   * @param digi 约为几位小数
   */
  async totalSupply(digi: number = 2) {
    const { status, datas } = await bpRead(this.coinObj.totalSupply);

    return {
      totalSupplyOrigin: status ? datas : '0',
      totalSupplyShow: status ? bpFormat(datas, -digi, this.decimals) : '0',
    };
  }

  /**
   * 判断是否授权
   * @param {String} hoster 托管给谁
   * @returns {Boolean} true 已经授权，false 没有授权
   */
  async allow(hoster: string) {
    const allowance = bpRead(this.coinObj.allowance, this.defaultAccount, hoster);
    const balance = this.getBalance() || {};
    const [{ status, datas }, { balanceOrigin }] = (await Promise.all([allowance, balance])) as any;
    if (!status) {
      return false;
    }
    return bpGt(datas, balanceOrigin);
  }

  /**
   * 授权
   * @param {String} hoster 托管给谁
   */
  async auth(hoster: string) {
    const { status } = await bpWrite(
      $t('msg.3'),
      this.coinObj.approve,
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
  async transfer(recipient: string, amount) {
    if (!this.decimals) {
      this.decimals = await this.getDecimals();
    }
    const cloneAmount = bpMul(amount, 10 ** this.decimals);
    const { status } = await bpWrite($t('msg.5'), this.coinObj.transfer, recipient, cloneAmount);
    return status;
  }

  /**
   * 被动转账
   * @param sender 转账者
   * @param recipient 接收者
   * @param amount 数额
   * @returns
   */
  async transferFrom(sender: string, recipient: string, amount) {
    if (!this.decimals) {
      this.decimals = await this.getDecimals();
    }
    const cloneAmount = bpMul(amount, 10 ** this.decimals);
    const { status } = await bpWrite(
      $t('msg.5'),
      this.coinObj.transferFrom,
      sender,
      recipient,
      cloneAmount
    );
    return status;
  }
}
