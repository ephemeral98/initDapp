// 代币 对象信息

// import { useAppStore } from '@store/appStore';
import { ethers } from 'ethers';
import { useAppStore } from '@/store/appStore';
import { IAddressObj } from './types';
import i18n from '@/locales/i18n';
import { bpFormat, bpGt, bpGte, bpMul } from '@/utils/bpMath';
import { bpRead, bpWrite } from '@/service/bpAction';
import useDefaultRpc from './useDefaultRpc';
const $t = i18n.global.t;

export default class {
  public lpObj; // 代币合约对象
  public decimals = 18; // 精度
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
      const lpObj = new ethers.Contract(addressObj.address, addressObj.abi, signer);
      this.lpObj = lpObj;
    } catch (err) {
      console.log('构建LpToken合约对象失败...');
    }
    return this.lpObj;
  }

  /**
   * 获取lp余额（带精度）
   * @param digi 约为几位小数
   */
  async getBalance(digi: number = 2) {
    const { status, datas } = (await bpRead(this.lpObj.balanceOf, this.defaultAccount)) || {};
    if (!status) console.log('getBalance...error');
    return {
      balanceOrigin: status ? datas : '0',
      balanceShow: status ? bpFormat(datas, -digi, this.decimals) : '0',
    };
  }

  /**
   * 获取两个币的token
   */
  async getTokens(): Promise<string[]> {
    const token0 = bpRead(this.lpObj.token0);
    const token1 = bpRead(this.lpObj.token1);
    const [{ datas: tokenRes0, status: sta1 }, { datas: tokenRes1, status: sta2 }] =
      await Promise.all([token0, token1]);

    if (!sta1 || !sta2) console.log('getTokens...error');

    return [tokenRes0, tokenRes1];
  }

  /**
   * 获取lp 两个token 对应的两个reserves
   * @param digi 约为几位小数
   */
  async getReserves(digi: number = 2) {
    const { status, datas } = await bpRead(this.lpObj.getReserves);
    if (!status) console.log('getReserves...error');
    return [
      {
        revOrigin: status ? datas[0] : '0',
        revShow: status ? bpFormat(datas[0], digi) : '0',
      },
      {
        revOrigin: datas[1],
        revShow: status ? bpFormat(datas[1], digi) : '0',
      },
    ];
  }

  /**
   * 获取lp 两个token 对应的两个reserves
   * @param tokenA
   * @param tokenB
   */
  async getTokenReserves(tokenA: string, tokenB: string) {
    const [token0, token1] = await this.getTokens();
    const [reserveAObj, reserveBObj] = await this.getReserves();

    if (token0.toUpperCase() === tokenA.toUpperCase()) {
      // 第一个是token0
      return [
        {
          token: token0,
          revOrigin: reserveAObj.revOrigin,
          revShow: reserveAObj.revShow,
        },
        {
          token: token1,
          revOrigin: reserveBObj.revOrigin,
          revShow: reserveBObj.revShow,
        },
      ];
    } else {
      // 第二个是token0
      return [
        {
          token: token1,
          revOrigin: reserveBObj.revOrigin,
          revShow: reserveBObj.revShow,
        },
        {
          token: token1,
          revOrigin: reserveAObj.revOrigin,
          revShow: reserveAObj.revShow,
        },
      ];
    }
  }

  /**
   * 判断是否授权
   * @param {String} contractAddr 合约地址
   * @returns {Boolean} true 已经授权，false 没有授权
   */
  async allow(contractAddr: string): Promise<boolean> {
    const allowance = bpRead(this.lpObj.allowance, this.defaultAccount, contractAddr);
    const balance = this.getBalance() || {};
    const [{ status, datas }, { balanceOrigin }] = (await Promise.all([allowance, balance])) as any;
    if (!status) {
      console.log('allow...error');
      return false;
    }
    return bpGt(datas, balanceOrigin);
  }

  /**
   * 授权
   * @param {String} contractAddr 合约地址
   */
  async auth(contractAddr: string) {
    return await bpWrite(
      $t('msg.3'),
      this.lpObj.approve,
      contractAddr,
      ethers.constants.MaxUint256
    );
  }

  /**
   * 主动转账
   * @param recipient 接收者
   * @param amount 数额
   */
  async transfer(recipient: string, amount) {
    const cloneAmount = bpMul(amount, 10 ** this.decimals);
    const { status } = await bpWrite('转账成功', this.lpObj.transfer, recipient, cloneAmount);
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
    const cloneAmount = bpMul(amount, 10 ** this.decimals);
    const { status } = await bpWrite(
      '转账成功',
      this.lpObj.transferFrom,
      sender,
      recipient,
      cloneAmount
    );
    return status;
  }

  // test方法：报错
  async errFunc() {
    return {
      status: false,
      message: '报错了',
    };
  }
}
