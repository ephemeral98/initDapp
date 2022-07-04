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
    lockUpdate: true, // 是否锁住，禁止更新所有组件和store
  }),

  actions: {
    /**
     * 连接小狐狸钱包
     */
    async linkWallet() {
      // 没有安装小狐狸
      if (!window.ethereum) {
        return false;
      }

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
      this.subscribeProvider(provider);
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
    switchChain(chainId) {
      if (this.defaultAccount == null) {
        ElMessage({
          message: $t('msg.7'),
          type: 'error',
        });
        return;
      }

      let ethereum = window?.ethereum;
      if (this.ethersObj.cachedProvider === 'bitkeep') {
        ethereum = window?.bitkeep?.ethereum;
      }

      const provider = new ethers.providers.Web3Provider(ethereum, 'any');
      const chainData = getChainData(chainId);
      const tx = provider.provider
        .request({ method: 'wallet_addEthereumChain', params: [chainData] })
        .then(() => {
          const providers: any = new ethers.providers.Web3Provider(window?.ethereum, 'any');
          this.ethersObj.chainId = providers?.provider?.chainId;
        })
        .catch((e) => {
          console.log('chain..', e);
        });
      console.log('chain tx..', tx);
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

      await _waiting().catch((err) => {
        ElMessage({
          message: $t('msg.17'),
          type: 'error',
        });
      });

      let provider, signer;
      try {
        provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
        signer = provider.getSigner();

        provider.getGasPrice().then((price) => {
          this.ethersObj.baseGasPrice = +price;
        });
      } catch (err) {}

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
    async subscribeProvider(provider) {
      // const { provider } = this.ethersObj;
      // console.log('provider.on....', provider.on);

      // 监听切账号
      window.ethereum?.on('accountsChanged', (accounts) => {
        console.log('账号切换了...', accounts);
        this.lockUpdate = false;
        this.defaultAccount = accounts[0];
      });

      // 监听切链
      window.ethereum?.on('chainChanged', async (chainId) => {
        console.log('链切换了...', chainId);
        this.lockUpdate = false;
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
    setrightChain(status: boolean) {
      this.rightChain = status;
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
