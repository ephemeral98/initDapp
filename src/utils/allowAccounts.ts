// 允许操作的钱包
export const accountArr: string[] = [
  '0xb0fE4FB305bc1A2de833fe85C71d129485226ff5',
  '0x2c1BbCDCa84Fd84C38652D75D67044711eF027ad',
];

/**
 * 是否允许该钱包操作
 * @param account 钱包地址
 */
export function allowAccounts(account: string): boolean {
  const resp = accountArr.find((item) => {
    return item.toUpperCase() === account.toLocaleUpperCase();
  });
  return !!resp?.length;
}
