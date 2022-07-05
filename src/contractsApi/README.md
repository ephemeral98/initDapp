## 注意事项：
1. 所有的方法都不让返回 Promise.reject 状态，统一由 status 管理，
status 为 true 则该交易请求成功，false则失败

2. 在hooks中有 ```useRead``` 和 ```useWrite```，分别对应的读写，
一般时不需要错误消息处理的，如果有场景需求，则需要返回:
```
{
  status: false, // 状态标记为false
  message: string, // 错误消息
}
```
那么，在使用这两个hooks的时候，就能获取到错误消息

3. 在每个合约对象构建```createContract```的时候，需要手动引入 ```useDefaultRpc```，目的是如果没有小狐狸，则使用预设好的rpc构建合约对象。
