import { createContext, useContext } from "react";

export const GlobalContext = createContext(null)

export const useGlobalContext = () => useContext(GlobalContext)
