// 这个是用来测试的合约
import { STAKE_CONT } from '@/contracts/address';
import { useAppStore } from '@store/appStore';
import i18n from '@/locales/i18n';
import useDefaultRpc from './useDefaultRpc';
import { bpFormat, bpMul } from 'bp-math';
import { bpRead, bpWrite } from '@/service/bpAction';
import { ElMessage } from 'element-plus';
import { watchAccount } from '@/hooks/useAction';
import { reactive, Ref, ref } from 'vue';

const $t = i18n.global.t;

export default () => {
  const appStore = useAppStore();
  const created = ref<boolean>(false); // 合约对象是否构建完
  const stakeObj = ref<any>({}); // 代币合约对象
  const decimals = ref<number>(18); // 代币精度

  /**
   * 构建代币对象
   */
  async function createContract() {
    const signer = useDefaultRpc();
    try {
      stakeObj.value = new appStore.ethersObj.ethers.Contract(
        STAKE_CONT.address,
        STAKE_CONT.abi,
        signer
      );
    } catch (error) {
      console.log('构建质押合约对象失败', error);
    }
    created.value = true;
    return stakeObj;
  }
  createContract();

  // 添加钱包监听
  watchAccount(() => {
    createContract();
  });

  const inviter = ref('');
  async function userInfo() {
    const resp = await bpRead(stakeObj.value.userInfo, appStore.defaultAccount);
    console.log('获取用户信息,', resp);
    if (!resp.status) console.log('getUserInfo...error...');
    inviter.value = resp.datas?.invitor || '';
    return resp;
  }

  /**
   * 质押挖矿
   * @param amount 质押数量
   * @param inv 邀请人
   */
  async function stake(amount: BigNumStr, inv: string) {
    const cloneAmount = bpMul(amount, 10 ** 18);
    const { status } = await bpWrite({ success: $t('base.7') }, stakeObj.value.stake, {
      value: cloneAmount,
    });
    return status;
  }

  return {
    created,
    inviter,
    userInfo,
    createContract,
    stake,
  };
};
