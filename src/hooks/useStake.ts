// 质押 hook
import { reactive, ref } from 'vue';
import MintContractApi from '@/contractsApi/useMintContractApi';
import LpToken from '@/contractsApi/useLpToken';
import { LP_MINT_CONT, MINT_ADDR } from '@/contracts/address';
import { bpMul } from '@/utils/bpMath';
import { ElMessage } from 'element-plus';
import i18n from '@/locales/i18n';
const $t = i18n.global.t;

export function useStakeInp() {}

/**
 * eg:
 * Vue template:
 * <!-- max按钮 -->
 * <button @click="handleMax(props.userInfo?.balance, props.userInfo?.balanceShow)">MAX</button>
 *
 * <!-- 确定按钮 -->
 * <button v-if="hasAllow" v-loading="loadingStake" @click="handleStake">
 *   {{ $t('common.1') }}
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
