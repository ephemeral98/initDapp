<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAppStore } from '@/store/appStore';
import MintContractApi from '@/contractsApi/MintContractApi';
import NftToken from '@/contractsApi/NftToken';
import { useWrite } from '@/hooks/useAction';
import { NFT_CONT } from '@/contracts/address';

const appStore = useAppStore();
const mintObj = new MintContractApi();
const nftObj = new NftToken({ address: NFT_CONT.address, abi: NFT_CONT.abi });

const showMintPop = ref(false); // 是否展示mint之后的nft弹窗

/**
 * 控制铸造
 */
const mintVal = ref(1);
function conMint(status: boolean) {
  if (mintVal.value > 1 && !status) {
    mintVal.value--;
  } else if (status) {
    mintVal.value++;
  }
}

const markText = computed(() => {
  return appStore.curLang === 'cn'
    ? require('@img/mark-text-cn.png')
    : require('@img/mark-text-en.png');
});

const mintLens = ref(0); // mint数量
const nftList = ref([]); // mint出来的nft图
/**
 * 铸造
 */
const [handleMint, loadMint] = useWrite(async () => {
  const { lens, tokenIds, status } = await mintObj.batchMint(mintVal.value);
  if (!status) return false;

  if (lens <= 6) {
    nftList.value = await nftObj.tokenURI(tokenIds);
  }

  mintLens.value = lens;
  showMintPop.value = true;
  checkMeta();
});

function handleChange(e) {
  mintVal.value = +e.target.value;
}

const mintAmount = ref(0);
async function checkMeta() {
  const resp = await mintObj.metaInfo();
  mintAmount.value = resp;
}
checkMeta();
</script>

<template>
  <div class="mint-wrap">
    <!-- 插图 -->
    <img src="@img/img-witch.png" alt="" class="img-witch" />

    <div class="mint-main">
      <img :src="markText" alt="" class="mark-text" />
      <div class="mint-container">
        <!-- 发行量 -->
        <div :class="['row', { right: appStore.curLang === 'en' }]">
          <div class="name">{{ $t('home.5') }}</div>
          :
          <div class="val">2000</div>
        </div>
        <!-- 单价 -->
        <div class="row">
          <div class="name">{{ $t('home.6') }}</div>
          :
          <div class="val">{{ mintObj.price }}ETH</div>
        </div>
        <!-- 购买数量 -->
        <div :class="['buy-wrap row', { right: appStore.curLang === 'en' }]">
          <div class="name">{{ $t('home.7') }}</div>
          :
          <button class="sub" @click="conMint(false)">-</button>
          <input type="number" class="inp" :value="mintVal" @input="handleChange" />
          <button class="add" @click="conMint(true)">+</button>
        </div>
        <!-- 铸造 -->
        <BpButton v-loading="loadMint" class="mint-btn" @click="handleMint">
          {{ $t('home.8') }}
        </BpButton>

        <div class="tips">{{ $t('home.9') }}:{{ 2000 - mintAmount }} / 2000</div>
      </div>
    </div>
  </div>

  <!-- mint之后的弹窗 -->
  <van-popup v-model:show="showMintPop">
    <div v-show="mintLens <= 6" class="pop-container">
      <div :class="['pop-wrap mul']">
        <div class="head">{{ $t('home.11') }}</div>

        <div :class="['nfts grid']">
          <img :src="it" alt="" class="img-nft" v-for="(it, inx) in nftList" :key="inx" />
        </div>
      </div>
      <button class="confirm-btn" @click="showMintPop = !showMintPop">{{ $t('common.3') }}</button>
    </div>

    <div v-show="mintLens > 6" class="pop-container-mob">
      <div class="pop-wrap empty">
        <div class="msg">{{ $t('home.10') }} * {{ mintLens }}</div>
        <button class="confirm-btn" @click="showMintPop = !showMintPop">
          {{ $t('common.3') }}
        </button>
      </div>
    </div>
  </van-popup>
</template>

<style lang="scss" scoped>
.mint-wrap {
  @include -width(95%, 95%, 12rem);
  margin: 2.6rem auto 1.2rem;
  @include -margin-top(1.5rem, 0.8rem, vw(50));
  @media (min-width: 749px) and (max-width: 900px)  {
    margin-top: 1.2rem;
  }
  @include flexPos(space-between);

  @media (max-width: 800px) {
    flex-direction: column;
  }
}
.img-witch {
  @include -width-a(571);
}

.mark-text {
  width: 4.6rem;
}

.mint-container {
  text-align: center;
  font-size: 0.33rem;

  .row {
    @include flexPos(flex-start);
    margin-top: 0.15rem;
    .name {
      min-width: 1.6rem;
      text-align-last: justify;
    }

    &.right {
      .name {
        text-align: right;
        text-align-last: auto;
      }
    }

    .val,
    .sub {
      margin-left: 0.2rem;
      margin-top: 0.05rem;
    }
  }

  .buy-wrap {
    display: flex;

    button {
      width: 0.48rem;
      height: 0.48rem;
      background-color: #2f76d2;
      @include flexPos(center);
      border-radius: 0.1rem;
    }

    .inp {
      width: 0.8rem;
      background-color: transparent;
      border: none;
      text-align: center;
      margin: 0 0.05rem;
    }
  }

  .mint-btn {
    width: 3.7rem;
    height: 1rem;
    margin: 0.41rem 0 0.21rem;
    background-image: url(@img/bg-ming-btn.png);
    background-size: 100% 100%;
  }

  .tips {
    font-size: 0.24rem;
    text-align: right;
  }
}

// 弹窗
.pop-wrap {
  margin: 0 !important;
  @include -width(svw(540), mvw(740), vw(540));

  background-size: 100% 100%;
  /* padding: 0.5rem 0.5rem; */
  overflow: auto !important;
  color: #410000;
  font-family: reeji;

  &.mul {
    @include -height(svw(710), mvw(810), vw(710));
    background-image: url(@img/bg-pop.png);

    .head {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      top: 0.5rem;
      font-size: 0.3rem;
    }
  }

  &.empty {
    @include -width(svw(650), vw(980), vw(880));
    @include -height-a(414);
    background-image: url(@img/bg-pop-msg.png);
    @include -font-size(0.18rem, 0.18rem, 0.26rem);
  }

  position: relative;
  border-radius: 0.1rem;
  overflow: hidden;

  .msg {
    position: absolute;
    left: 50%;
    top: 35%;
    transform: translateX(-50%);
    white-space: nowrap;
  }

  .nfts {
    @include flexPos(center);
    /* background-color: pink; */
    padding: 0 vw(55);
    @media (max-width: $pad) {
      padding: 0 0.6rem;
    }
    overflow: auto;
    width: 100%;
    @include -height(4.3rem, svw(310), vw(450));
    margin: 1.5rem auto 0;

    @include -margin-top(1.5rem, svw(100), vw(150));

    &.grid {
      display: grid;
      justify-content: center;
      grid-template-columns: auto auto;
      grid-gap: 0.2rem 0.3rem;
    }
  }
}

.confirm-btn {
  position: absolute;
  @include -top(2.3rem, 50%, 1.6rem);
  padding: 0.08rem 0.3rem;
  color: #000;
  left: 50%;
  transform: translateX(-50%);
  background-image: url(@img/bg-ming-btn.png);
  background-size: 100% 100%;
  color: #fff;
  @include -font-size(0.28rem, svw(24), vw(24));
}

.img-nft {
  width: 1.45rem;
  border-radius: 0.15rem;
}

.pop-container {
  .confirm-btn {
    top: auto;
    bottom: 0.39rem;
  }
}

.pop-container-mob {
  .confirm-btn {
    @include -top(2.3rem, 50%, vw(230));
  }
}
</style>
