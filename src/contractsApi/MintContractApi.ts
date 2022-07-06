// 这个是用来测试的合约
import { MINT_CONT } from '@/contracts/address';
import { useAppStore } from '@store/appStore';
import i18n from '@/locales/i18n';
import useDefaultRpc from './useDefaultRpc';
const $t = i18n.global.t;

export default class {
  public mintObj;
  public defaultAccount;
  public baseGasPrice;

  constructor() {
    this.createContract();
  }

  /**
   * 构建合约对象
   */
  async createContract() {
    const signer = useDefaultRpc();
    const appStore = useAppStore();
    this.defaultAccount = appStore.defaultAccount;
    this.baseGasPrice = appStore.ethersObj.baseGasPrice;
    try {
      this.mintObj = new appStore.ethersObj.ethers.Contract(
        MINT_CONT.address,
        MINT_CONT.abi,
        signer
      );
    } catch (error) {
      console.log('构建质押合约对象失败', error);
    }

    // const token = await ethers.getContractAt("Token", MINT_CONT.address);
  }

  /**
   * 获取邀请人
   */
  async getInviter() {
    return '';
  }


  /**
   * 质押
   */
  async stake(type, pid) {
    console.log('质押...', type, pid);
  }
}
