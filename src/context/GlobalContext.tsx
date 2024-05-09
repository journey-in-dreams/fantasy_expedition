import React from "react";
import { createContext, useContextSelector } from "use-context-selector";
import { IGlobalContext, useInitGlobal } from "./useInitGlobal";

export type TSetData<T> = React.Dispatch<React.SetStateAction<T>>;

const context = createContext<IGlobalContext>({} as IGlobalContext);

const GlobalProvider = context.Provider;

function useGlobalContext<T extends keyof IGlobalContext>(
  func: (s: IGlobalContext) => IGlobalContext[T],
) {
  return useContextSelector(context, func);
}

interface IGlobalContextProps {
  children: React.ReactNode;
}

const GlobalContextProvider: React.FC<IGlobalContextProps> = ({ children }) => {
  const { ...props } = useInitGlobal();
  return <GlobalProvider value={{ ...props }}>{children}</GlobalProvider>;
};

export { GlobalContextProvider, useGlobalContext };
