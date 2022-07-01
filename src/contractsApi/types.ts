/**
 * 地址对象：包括地址、abi
 */
export interface IAddressObj {
  address: string;
  abi: any;
}

/**
 * nft包含的信息
 */
export interface INft {
  id: string; // nft token id
  description?: string; // 描述
  attributes?: any[]; // 属性
  external_url?: string; // 一些额外链接
}
