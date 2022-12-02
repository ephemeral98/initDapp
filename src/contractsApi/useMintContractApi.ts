// 这个是用来测试的合约
import { MINT_CONT } from '@/contracts/address';
import { useAppStore } from '@store/appStore';
import i18n from '@/locales/i18n';
import useDefaultRpc from './useDefaultRpc';
import { bpFormat, bpMul } from '@/utils/bpMath';
import { bpRead, bpWrite } from '@/service/bpAction';
import { watchAccount } from '@/hooks/useAction';
const $t = i18n.global.t;

export default () => {
  const appStore = useAppStore();
  const created = ref<boolean>(false); // 合约对象是否构建完
  const mintObj = ref<any>({}); // 代币合约对象
  const decimals = ref<number>(18); // 代币精度

  /**
   * 构建代币对象
   * @param {Object} addressObj：包括合约地址、abi
   * 例如 去旁边的 address.js 里拿 BVG_TOKEN_CONT 传入
   * @returns 代币的信息
   */
  async function createContract() {
    const signer = useDefaultRpc();
    try {
      mintObj.value = new appStore.ethersObj.ethers.Contract(
        MINT_CONT.address,
        MINT_CONT.abi,
        signer
      );
    } catch (error) {
      console.log('构建质押合约对象失败', error);
    }
    created.value = true;
    return mintObj;
  }
  createContract();

  // 添加钱包监听
  watchAccount(() => {
    createContract();
  });

  /**
   * 质押
   */
  async function mint(amount: string | number) {
    const cloneAmount = bpMul(amount, 10 ** 18);
    const { status } = await bpWrite(true, mintObj.value.mint, {
      value: cloneAmount,
    });
    return status;
  }

  return {
    created,
    createContract,
    mint,
  };
};
