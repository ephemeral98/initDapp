// 代币 对象信息

// import { useAppStore } from '@store/appStore';
import { useAppStore } from '@/store/appStore';
import { IAddressObj, INft } from './types';
import i18n from '@/locales/i18n';
import { bpRead, bpWrite } from '@/service/bpAction';
import { bpFormat } from '@/utils/bpMath';
import useDefaultRpc from './useDefaultRpc';
import { ethers } from 'ethers';
import { $GET } from '@/service/request';

const $t = i18n.global.t;

export default class {
  public nftObj; // 代币合约对象
  public balance; // 余额
  public defaultAccount; // 用户钱包地址
  public medalList = []; // 我的勋章
  public decimals = 18; // 精度

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
      const nftObj = new ethers.Contract(addressObj.address, addressObj.abi, signer);
      this.nftObj = nftObj;
    } catch (err) {
      console.log('构建 nftToken 合约对象失败...');
    }
    return this.nftObj;
  }

  /**
   * 获取代币余额（带精度）
   * @param digi 约为几位小数
   */
  async getBalance(digi: number = 2) {
    const { status, datas } = (await bpRead(this.nftObj.balanceOf, this.defaultAccount)) || {};
    if (!status) console.log('getBalance...error...');
    return {
      balanceOrigin: status ? datas : '0',
      balanceShow: status ? bpFormat(datas, -digi, this.decimals) : '0',
    };
  }

  /**
   * 是否授权
   * @param addr 动作合约
   */
  async isApprovedForAll(addr: string): Promise<boolean> {
    const { status, datas } = await bpRead(this.nftObj.isApprovedForAll, this.defaultAccount, addr);
    if (!status) console.log('getBalance...error...');
    return status ? datas : false;
  }

  /**
   * 授权
   */
  async setApprovalForAll(addr) {
    const { status } = await bpWrite($t('msg.3'), this.nftObj.setApprovalForAll, addr, true);
    return status;
  }

  /**
   * nft转账
   * @returns
   * @param to 要转的地址
   * @param tokenId nft tokenId
   */
  async transferFrom(to: string, tokenId): Promise<boolean> {
    const { status } = await bpWrite(
      $t('msg.5'),
      this.nftObj.transferFrom,
      this.defaultAccount,
      to,
      tokenId
    );
    return status;
  }

  /**
   * 查询nft
   */
  async tokenURI(ids: number[]) {
    const resp = ids.map(async (id) => {
      const { datas } = await bpRead(this.nftObj.tokenURI, id);
      return datas;
    });

    const res = await Promise.all(resp);

    const metaData = res.map(async (url) => {
      const resp = await $GET(url);
      return resp;
    });

    const metaDataRes = await Promise.all(metaData);
    return metaDataRes?.map?.((item: any) => item.image);
  }
}
