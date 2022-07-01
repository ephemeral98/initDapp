import { LP_MINT_CONT } from '@/contracts/address';
import { useAppStore } from '@store/appStore';
import { toRaw } from 'vue';
import i18n from '@/locales/i18n';
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
    const appStore = useAppStore();
    this.defaultAccount = appStore.defaultAccount;
    const { ethers, signerValue } = appStore.ethersObj;
    this.baseGasPrice = appStore.ethersObj.baseGasPrice;
    const signer = toRaw(signerValue);
    try {
      this.mintObj = new ethers.Contract(LP_MINT_CONT.address, LP_MINT_CONT.abi, signer);
    } catch (error) {
      console.log('构建质押合约对象失败', error);
    }

    // const token = await ethers.getContractAt("Token", LP_MINT_CONT.address);
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
