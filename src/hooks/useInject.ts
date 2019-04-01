import { useStore } from "../StoreProvider"
import { RootStoreModel } from "../stores/RootStore"

export type MapStore<T> = (store: RootStoreModel) => T

const defaultMapStore: MapStore<RootStoreModel> = store => store

const useInject = <T>(mapStore?: MapStore<T>) => {
  const store = useStore()
  return (mapStore || defaultMapStore)(store)
}

export default useInject
