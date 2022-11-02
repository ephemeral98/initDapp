/**
 * 交易通讯状态
 */
interface ITransStatus {
  status: boolean; // 请求是否成功
  datas: any; // 请求的数据
  message?: string; // 错误时候的消息
}
