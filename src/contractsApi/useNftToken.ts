// 代币 对象信息

// import { useAppStore } from '@store/appStore';
import { ethers } from 'ethers';
import { useAppStore } from '@/store/appStore';
import i18n from '@/locales/i18n';
import { bpFormat, bpGt, bpMul } from 'bp-math';
import { bpRead, bpWrite } from '@/service/bpAction';
import useDefaultRpc from './useDefaultRpc';
import { reactive, Ref, ref } from 'vue';
import { watchAccount } from '@/hooks/useAction';
import axios from '@/service/request';

const $t = i18n.global.t;

export default (addressObj: IAddressObj) => {
  const appStore = useAppStore();
  const created = ref<boolean>(false); // 合约对象是否构建完
  const nftObj = ref<any>({}); // nft合约对象

  /**
   * 构建代币对象
   * @param {Object} addressObj：包括合约地址、abi
   * 例如 去旁边的 address.js 里拿 BVG_TOKEN_CONT 传入
   * @returns 代币的信息
   */
  function createContract(addressObj: IAddressObj) {
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
    origin: '0',
    show: '0',
  });
  /**
   * 获取余额（包括源数据和展示数据）
   * @param digi 约为几位小数
   * @param addr 查询谁的余额
   */
  async function getBalance(digi: number = 2, addr?: string) {
    const targetAddr = addr ?? appStore.defaultAccount;
    const { status, datas } = (await bpRead(nftObj.value.balanceOf, targetAddr)) || {};
    if (!status) console.log('getBalance...error...');

    balanceObj.origin = status ? datas : '0';
    balanceObj.show = status ? String(datas) : '0';

    return balanceObj;
  }

  // 是否授权所有
  const hasAllowForAll = ref<boolean>(false);
  /**
   * 是否授权
   * @param addr 动作合约
   */
  async function isApprovedForAll(addr: string): Promise<boolean> {
    const { status, datas } = await bpRead(
      nftObj.value.isApprovedForAll,
      appStore.defaultAccount,
      addr
    );
    if (!status) console.log('isApprovedForAll...error...');
    hasAllowForAll.value = status ? datas : false;
    return hasAllowForAll.value;
  }

  /**
   * 授权
   */
  async function setApprovalForAll(addr: string) {
    const { status } = await bpWrite(
      { success: $t('base.5') },
      nftObj.value.setApprovalForAll,
      addr,
      true
    );
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
      { success: $t('base.6') },
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
      const resp = await axios.get(url);
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
