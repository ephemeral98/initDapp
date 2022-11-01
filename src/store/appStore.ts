import { defineStore, storeToRefs } from 'pinia';
import { ethers } from 'ethers';
import { ElMessage } from 'element-plus';
import i18n from '@/locales/i18n';
const $t = i18n.global.t;

import { toRaw } from 'vue';
import { getChainData } from '@/utils/tools';

// ethers默认配置
const INIT_ETHERS = {
  ethers: ethers,
  instance: null,
  provider: {},
  signerValue: null, // 这个导出的时候是 proxy，需要用vue的toRaw转一下signer
  connected: false,
  cachedProvider: null,
  baseGasPrice: 0, // 基础gasPrice，后面设置gasPrice的时候，+= 此值
  chainId: '',
  // tips:
  // const appStore = useAppStore();
  // const { ethers, signerValue } = appStore.ethersObj;
  // const signer = toRaw(signerValue);
};

const useAppStore = defineStore('app', {
  state: () => ({
    defaultAccount: '', //钱包账号
    lang: '', // 语言
    curDevice: 'pad',
    rightChain: true, // 当前页面是否在对的链
    loadRead: '', // 是否在读取链上方法中
    ethersObj: INIT_ETHERS,
    lockUpdate: true, // 是否锁住，防止首次加载的时候导致的切链('' -> '0x')
    chainTimer: null, // 切链timer
    netWorkReady: false, // 成功获取链和钱包等准备工作
    touchAfterWatchAccount: 0, // 告诉useRead，已重新构建合约对象
  }),

  actions: {
    /**
     * 连接小狐狸钱包
     */
    async linkWallet(): Promise<void | boolean> {
      // 已经连接了钱包
      if (this.defaultAccount) {
        return true;
      }

      await this.setEthersObj();
      const { provider } = this.ethersObj;
      await provider
        ?.send('eth_requestAccounts', [])
        .then(async () => {
          ElMessage({
            message: $t('msg.1'),
            type: 'success',
          });
          await this.getDefaultAccount();
        })
        .catch(() => {
          ElMessage({
            message: $t('msg.2'),
            type: 'error',
          });
        });

      // 获取链id
      this.ethersObj.chainId = toRaw(provider).provider.chainId;
      // 添加一系列钱包监听
      this.subscribeProvider();
    },

    /**
     * 设置钱包地址
     */
    async setAccount(account: string) {
      this.defaultAccount = account;
    },

    /**
     * 获取钱包地址
     * @returns {*} 钱包地址
     */
    async getDefaultAccount() {
      if (this.defaultAccount) return;
      let account;
      try {
        const { signerValue } = this.ethersObj;
        const signer = toRaw(signerValue);
        // 尝试从链上拿钱包
        account = await signer.getAddress();
      } catch (err) {
        ElMessage({
          message: $t('msg.4'),
          type: 'error',
        });
      }
      this.setAccount(account);
      return account;
    },

    /**
     * 切换链
     * @param chainId 链id
     * @returns
     */
    async switchChain(chainId: string) {
      // 没有小狐狸插件，则跳去下载
      if (!window?.ethereum) {
        window.open('https://metamask.io/download/');
        return;
      }

      let ethereum = window?.ethereum;
      if (this.ethersObj.cachedProvider === 'bitkeep') {
        ethereum = window?.bitkeep?.ethereum;
      }

      const providerWrap: any = new ethers.providers.Web3Provider(ethereum, 'any');

      /**
       * 切链事件
       */
      async function _handleChange() {
        if (+ethereum.chainId === +chainId) {
          // 如果当前链和切换的链一样，则不做操作
          return;
        }

        // 将切到以太坊和其他的链 方法分开
        if (chainId === '0x1') {
          const hexChainId = ethers.utils.hexValue(chainId);
          return await providerWrap.provider.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: hexChainId }],
          });
        }
        const chainData = getChainData(chainId);
        return await providerWrap.provider.request({
          method: 'wallet_addEthereumChain',
          params: [chainData],
        });
      }

      try {
        // 记录旧的chainId
        const oldChainId = this.ethersObj.chainId;
        // 用户有链的id就直接切换
        await _handleChange().then(async () => {
          if (window.ethereum?.isTokenPocket) {
            // TP钱包才给 loading提示，因为PC点了拒绝，也会到这里。。
            ElMessage.info($t('common.2'));
          }

          clearInterval(this.chainTimer);
          this.chainTimer = setInterval(() => {
            // console.log('new ethers.providers...', ethers.providers.Web3Provider);
            const newProviderWrap: any = new ethers.providers.Web3Provider(window?.ethereum, 'any');
            // 获取新的chainId
            const newChainId = newProviderWrap?.provider?.chainId;

            // 根据判断俩chainId，判断是否成功切了链
            if (+newChainId !== +oldChainId) {
              // console.log('切完了链', window.ethereum);

              this.ethersObj.chainId = newChainId;

              if (window.ethereum?.isTokenPocket) {
                // TP钱包，iPhone有坑，切换了链，chainId变了，但是rpc没变。这里强行修改rpc。
                const chainData = getChainData(newChainId);
                window.ethereum.rpc.rpcUrl = chainData.rpcUrls;
              }
              // 确实成功切了链
              ElMessage.success($t('msg.10'));

              clearInterval(this.chainTimer);
              // 开锁，更新所有组件数据
              this.lockUpdate = false;
            }
          }, 500);
        });
      } catch (error) {
        ElMessage.error($t('msg.11'));
        console.log('切换链错误..', error);
      }
    },

    /**
     * 设置多语言
     */
    setLang(lang) {
      this.lang = lang;
      window.localStorage.setItem('lang', lang);
    },

    /**
     * 获取当前使用的设备视口宽度
     */
    getCurDevice() {
      const clientWidth = window.innerWidth;
      if (clientWidth <= 750) {
        this.curDevice = 'phone';
      } else if (clientWidth <= 1280 && clientWidth > 750) {
        this.curDevice = 'pad';
      } else {
        this.curDevice = 'pc';
      }
    },

    /**
     * 获取ethers api
     */
    async setEthersObj() {
      /**
       * 等待获取小狐狸插件钱包
       * @returns
       */
      function _waiting(): Promise<any> {
        const duration = 100;
        return new Promise<void>((resolve, reject) => {
          let count = 0;
          const timer = setInterval(() => {
            if (window.ethereum) {
              resolve();
              clearInterval(timer);
            }
            count++;
            // 1秒内还获取不到小狐狸，则
            const sec = (1 * 1000) / duration;
            if (count > sec) {
              reject();
              clearInterval(timer);
            }
          }, duration);
        });
      }

      await _waiting().catch((err) => console.log(err));

      let provider, signer;
      try {
        provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
        signer = provider.getSigner();

        const price = await provider.getGasPrice();
        this.ethersObj.baseGasPrice = +price ?? 0;
      } catch (err) {
        console.log('err...', err);
      }

      this.ethersObj = {
        ...this.ethersObj,
        ethers,
        provider,
        signerValue: signer,
      };
    },

    /**
     * 设置加载读方法
     */
    setLoadRead(status) {
      this.loadRead = status;
    },

    /**
     * 监听钱包状态
     * @param {*} provider
     * @returns
     */
    async subscribeProvider() {
      // const { provider } = this.ethersObj;
      // console.log('provider.on....', provider.on);

      // 监听切账号
      window.ethereum?.on('accountsChanged', (accounts) => {
        this.defaultAccount = accounts[0];
      });

      // 监听切链(TP不兼容)
      window.ethereum?.on('chainChanged', async (chainId) => {
        console.log('链切换了...', chainId);
        this.ethersObj.chainId = chainId;
      });

      /* // 监听连接钱包
      window.ethereum?.on('connect', (error, payload) => {
        console.log('钱包连接了...', error, payload);
      });

      // 监听断开连接钱包
      window.ethereum?.on('disconnect', (error) => {});

      // 断开连接
      window.ethereum?.on('close', () => {}); */
    },

    /**
     * 设置是否为对的链
     */
    setRightChain(status: boolean) {
      this.rightChain = status;
    },

    /**
     * 设置网络准备状态
     */
    setNetWorkReady(status: boolean) {
      this.netWorkReady = status;
    },

    /**
     * 设置watchAccount之后
     */
    setTouchAfterWatchAccount(count: number) {
      this.touchAfterWatchAccount = count;
    },
  },

  getters: {
    // 获取当前语言: en、cn、kn
    curLang() {
      return this.lang || window.localStorage.getItem('lang') || 'en';
    },
  },
});

export { storeToRefs, useAppStore };
