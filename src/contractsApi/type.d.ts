// number、string、ethers的bigNumber 类型
type BigNumStr = number | string | BigNumber;

/**
 * 地址对象：包括地址、abi
 */
interface IAddressObj {
  address: string;
  abi: any;
}
