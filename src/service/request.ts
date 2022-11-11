import axios from 'axios';
import { ElMessage } from 'element-plus';

const masterUrl = ''; // 域名https 正式服

// const baseURL = process.env.NODE_ENV == 'development' ? testUrl : '';
const baseURL = '';

const defaultConfig = {
  baseURL,
  timeout: 30000,
};
Object.assign(axios.defaults, defaultConfig);
axios.defaults.headers['Content-Type'] = 'application/json';

// 请求拦截器
axios.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么
    /* const uid = localMemory.getItem('uid') || ''

    const params = { 
      uid,
    } */

    /* if (config.method === 'get') {
      config.params = {
        ...config.params,
        ...params,
      };
    } else {
      config.data = {
        ...config.data,
        ...params,
      };
    } */
    return config;
  },
  (err) => {
    // 对请求错误做些什么
    return Promise.reject(err);
  }
);

// 响应拦截器
axios.interceptors.response.use(
  (resp) => {
    return resp.data;
  },
  (err) => {
    return Promise.reject(err);
  }
);

/**
 * get请求
 * @param {Object} params 请求参数query
 * @returns {Promise}
 * @author gzq
 */
export function $GET(url, params?) {
  return new Promise((resolve, reject) => {
    axios
      .get(url, { params })
      .then((resp) => {
        resolve(resp);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

/**
 * post请求
 * @param {Object} params 请求参数 body
 * @returns {Promise}
 * @author gzq
 */
export function $POST(url, params?) {
  return new Promise((resolve, reject) => {
    axios
      .post(url, params)
      .then((resp) => {
        resolve(resp);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export default axios;
