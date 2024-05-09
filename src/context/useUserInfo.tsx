import { useState } from "react";

import { IUser } from "@/types/config";

type TSetData<T> = React.Dispatch<React.SetStateAction<T>>;
export interface IUseUserInfo {
  userInfo: IUser;
  setUserInfo: TSetData<IUser>;
}

export const useUserInfo = () => {
  const [userInfo, setUserInfo] = useState<IUser>({}); // 用户信息

  return {
    userInfo,
    setUserInfo,
  };
};
