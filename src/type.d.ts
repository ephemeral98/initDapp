export {};
declare module 'vue' {
  interface ComponentCustomProperties {
    $p: (param: string) => string;
  }
}

/**
 * 交易通讯状态
 */
interface ITransStatus {
  status: boolean; // 请求是否成功
  datas: any; // 请求的数据
  errorOrigin?: string; // 错误时候的消息(源)
  message?: string; // 错误时候的消息
}
