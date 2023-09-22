import { RootStore, RootStoreHydration } from "@/stores/RootStore";
import { count } from "console";
import { enableStaticRendering } from "mobx-react-lite";
import { createContext, useContext } from "react";

enableStaticRendering(typeof window === "undefined");

interface RootStoreProps {
  children: React.ReactNode;
  hydrationData?: RootStoreHydration;
}

let store: RootStore;

const StoreContext = createContext<RootStore | undefined>(undefined);

export function useRootStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error("useRootStore must be used within a RootStoreProvider");
  }
  return context;
}

export function useGlobalStore() {
  const {globalStore} = useRootStore();
  return globalStore;
}

export function useUserStore() {
  const {userStore} = useRootStore();
  return userStore;
}

export function useSimulationSettingStore() {
  const {simulationSettingStore} = useRootStore();
  return simulationSettingStore;
}

export function useCountryStore() {
  const {countryStore} = useRootStore();
  return countryStore;
}

export function RootStoreProvider({children, hydrationData}: RootStoreProps) {
  const _store = initializeStore(hydrationData);
  return (
    <StoreContext.Provider value={_store}>
      {children}
    </StoreContext.Provider>
  )
}

function initializeStore(initialData?: RootStoreHydration): RootStore {
  const _store = store ?? new RootStore();
  // if (initialData) {
  //   _store.hydrate(initialData);
  // }
  // For SSG and SSR always create a new store
  if (typeof window === "undefined") return _store;
  // Create the store once in the client
  if (!store) store = _store;

  return _store;
}