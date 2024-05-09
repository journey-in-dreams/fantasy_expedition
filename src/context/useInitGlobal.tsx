import { IUseUserInfo, useUserInfo } from "./useUserInfo";

/**
 * 全局数据定义
 */
export type IGlobalContext = IUseUserInfo;

type TUseInitGlobal = () => IGlobalContext;

export const useInitGlobal: TUseInitGlobal = () => {
  const userInfoData = useUserInfo();

  return {
    ...userInfoData,
  };
};
