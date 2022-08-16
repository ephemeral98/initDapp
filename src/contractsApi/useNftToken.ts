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
import { $GET } from '@/service/request';

const $t = i18n.global.t;

export default (addressObj: IAddressObj) => {
  const appStore = useAppStore();
  const created = ref<boolean>(false); // 合约对象是否构建完
  const nftObj = ref<any>({}); // nft合约对象
  const decimals = ref<number>(18); // 精度

  /**
   * 构建代币对象
   * @param {Object} addressObj：包括合约地址、abi
   * 例如 去旁边的 address.js 里拿 BVG_TOKEN_CONT 传入
   * @returns 代币的信息
   */
  function createContract(addressObj) {
    const signer = useDefaultRpc();
    try {
      nftObj.value = new ethers.Contract(addressObj.address, addressObj.abi, signer);
    } catch (error) {
      console.log('构建nft合约对象失败...');
    }
    created.value = true;
    return nftObj;
  }
  createContract(addressObj);

  // 添加钱包监听
  watchAccount(() => {
    createContract(addressObj);
  });

  // 余额
  const balanceObj = reactive({
    balanceOrigin: '0',
    balanceShow: '0',
  });
  /**
   * 获取余额（包括源数据和展示数据）
   * @param digi 约为几位小数
   */
  async function getBalance(digi: number = 2) {
    const { status, datas } = (await bpRead(nftObj.value.balanceOf, appStore.defaultAccount)) || {};
    if (!status) console.log('getBalance...error...');

    balanceObj.balanceOrigin = status ? datas : '0';
    balanceObj.balanceShow = status ? bpFormat(datas, -digi, decimals.value) : '0';

    return balanceObj;
  }

  // 是否授权所有
  const hasAllowForAll = ref<boolean>(false);
  /**
   * 是否授权
   * @param addr 动作合约
   */
  async function isApprovedForAll(addr: string): Promise<Ref<boolean>> {
    const { status, datas } = await bpRead(
      nftObj.value.isApprovedForAll,
      this.defaultAccount,
      addr
    );
    if (!status) console.log('isApprovedForAll...error...');
    hasAllowForAll.value = status ? datas : false;
    return hasAllowForAll;
  }

  /**
   * 授权
   */
  async function setApprovalForAll(addr: string) {
    const { status } = await bpWrite($t('msg.3'), nftObj.value.setApprovalForAll, addr, true);
    return status;
  }

  /**
   * 被动转账
   * @param sender 转账者
   * @param recipient 接收者
   * @param amount 数额
   * @returns
   */
  async function transferFrom(to: string, tokenId) {
    const { status } = await bpWrite(
      $t('msg.5'),
      nftObj.value.transferFrom,
      appStore.defaultAccount,
      to,
      tokenId
    );
    return status;
  }

  /**
   * 查询nft
   */
  async function tokenURI(ids: number[]) {
    const resp = ids.map(async (id) => {
      const { datas } = await bpRead(nftObj.value.tokenURI, id);
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

  return {
    balanceObj,
    hasAllowForAll,
    isApprovedForAll,
    setApprovalForAll,
    transferFrom,
    getBalance,
    tokenURI,
  };
};