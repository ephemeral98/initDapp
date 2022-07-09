// 质押 hook
import { reactive, ref } from 'vue';
import MintContractApi from '@contApi/MintContractApi';
import LpToken from '@contApi/LpToken';
import { LP_MINT_CONT, MINT_ADDR } from '@/contracts/address';
import { bpMul } from '@/utils/bpMath';
import { ElMessage } from 'element-plus';
import i18n from '@/locales/i18n';
const $t = i18n.global.t;

export function useStakeInp() {
  const lpObj = new LpToken(LP_MINT_CONT);
  const mintObj = new MintContractApi();

  // 判断是否授权
  const hasAllow = ref(false);

  // 质押数量
  const stakeNum = reactive({
    origin: '', // 数据源
    show: '', // 展示
  });

  /**
   * 推荐人
   */
  // 如没有推荐人,则输入推荐人
  const inpInv = ref('');

  const inviter = ref(''); // 推荐人
  /**
   * 获取推荐人
   */
  async function getInviter() {
    inviter.value = await mintObj.getInviter();
  }
  getInviter();

  /**
   * 手动输入质押量
   */
  function changeStakeNum(e) {
    stakeNum.origin = e.target.value;
    stakeNum.show = e.target.value;
  }

  /**
   * 输入最大值
   */
  function handleMax(balance, balanceShow) {
    stakeNum.origin = balance;
    stakeNum.show = balanceShow;
  }

  const loadingStake = ref(false);
  /**
   * 授权
   */
  async function handleAuth() {
    if (loadingStake.value) return;
    loadingStake.value = true;
    await lpObj.auth(MINT_ADDR);
    loadingStake.value = false;
    checkHasAllow();
  }

  /**
   * 确认质押
   */
  async function confirmStake(callback: Function) {
    if (loadingStake.value) return;
    loadingStake.value = true;
    let inv;
    // 没有推荐人
    if (!+inviter.value) {
      inv = inpInv.value.trim();
    } else {
      // 有推荐人
      inv = inviter.value;
    }

    if (!+inv && !String(inpInv.value)) {
      // 提示: 请输入推荐人地址
      ElMessage.error($t('nodeDividend.16'));
    } else if (!+stakeNum.origin) {
      // 提示：请输入质押数量
      ElMessage.error($t('common.1'));
    }

    // 判断是不是max，还是手动输入的
    let stakeValue =
      typeof stakeNum.origin === 'string' ? bpMul(stakeNum.origin, 10 ** 18) : stakeNum.origin;

    if ((+inv || String(inpInv.value)) && +stakeNum.origin) {
      await mintObj.stake(stakeValue, inv);
    }
    // 重置
    loadingStake.value = false;
    inpInv.value = '';
    stakeNum.origin = '';
    stakeNum.show = '';

    getInviter();
    callback();
  }

  /**
   * 查询是否授权
   */
  async function checkHasAllow() {
    hasAllow.value = await lpObj.allow(MINT_ADDR);
    console.log('hasAllow.value...', hasAllow.value);
  }
  checkHasAllow();

  return {
    loadingStake, // 加载状态
    stakeNum, // 质押数量：包括源数据和展示数据
    inpInv, // 推荐人输入框
    inviter, // 推荐人
    hasAllow, // 是否授权
    changeStakeNum, // 质押输入框的值
    handleMax, // 输入最大按钮
    handleAuth, // 授权操作
    confirmStake, // 质押操作
  };
}

/**
 * eg:
 * Vue template:
 * <!-- max按钮 -->
 * <button @click="handleMax(props.userInfo?.balance, props.userInfo?.balanceShow)">MAX</button>
 *
 * <!-- 确定按钮 -->
 * <button v-if="hasAllow" v-loading="loadingStake" @click="handleStake">
 *   {{ $t('common.6') }}
 * </button>
 *
 * Vue script:
 * const {
 * loadingStake,
 * stakeNum,
 * inpInv,
 * inviter,
 * hasAllow,
 * changeStakeNum,
 * handleMax,
 * handleAuth,
 * confirmStake,
 * } = useStakeInp();
 *
 * function handleStake() {
 *  confirmStake(() => {
 *    $emits('reset');
 *  });
 * }
 */
