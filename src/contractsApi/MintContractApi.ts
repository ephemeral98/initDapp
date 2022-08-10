// 这个是用来测试的合约
import { MINT_CONT } from '@/contracts/address';
import { useAppStore } from '@store/appStore';
import i18n from '@/locales/i18n';
import useDefaultRpc from './useDefaultRpc';
import { bpMul } from '@/utils/bpMath';
import { bpWrite } from '@/service/bpAction';
import { ElMessage } from 'element-plus';
const $t = i18n.global.t;

const BATCH_MINT_TOPICS = '0x0f6798a560793a54c3bcfe86a93cde1e73087d944c0ea20544137d4121396885';

export default class {
  public mintObj;
  public defaultAccount;
  public baseGasPrice;
  public price = 0.02; // 价格

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

  async metaInfo() {
    const resp = await this.mintObj.meta();
    return +resp.mintAmount;
  }

  /**
   * 批量铸造
   */
  async batchMint(num: number) {
    if (!num) {
      ElMessage.error($t('msg.13'));
      return { status: false };
    }

    const amount = num * this.price;
    const cloneAmount = bpMul(amount, 10 ** 18, true);

    let limit = 1;
    try {
      limit = await this.mintObj.estimateGas.batchMint(this.mintObj.batchMint, num, {
        value: cloneAmount,
      });
    } catch (error) {
      limit = 1;
      console.log('设置gasLimit失败');
    }

    const { datas, status } = await bpWrite($t('msg.12'), this.mintObj.batchMint, num, {
      value: cloneAmount,
      gasLimit: (Number(limit) * 1.5).toFixed(0),
    });

    if (!status) return { status };

    // 找到抽盲盒的事件
    const batchMintEvent = datas?.filter?.((item) => {
      if (item.topics?.[0]?.toUpperCase?.() === BATCH_MINT_TOPICS.toUpperCase()) {
        return item;
      }
    });

    const tokenIdArr = batchMintEvent.map((batch) => {
      return +batch.topics[2];
    });

    return {
      lens: tokenIdArr.length,
      tokenIds: tokenIdArr,
      status,
    };
  }
}
