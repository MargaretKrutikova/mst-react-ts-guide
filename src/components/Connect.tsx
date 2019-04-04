import { observer } from "mobx-react-lite"
import { RootStoreModel } from "../stores/RootStore"
import { useStore } from "./StoreProvider"

export const connect = <TOwnProps extends object, TMappedProps>(
  mapStoreToProps: (store: RootStoreModel, ownProps: TOwnProps) => TMappedProps
) => (WrappedComponent: React.ComponentType<TOwnProps & TMappedProps>) => {
  const ObserverWrappedComponent = observer<TOwnProps & TMappedProps>(
    WrappedComponent as any
  )

  const ConnectComponent: React.FunctionComponent<TOwnProps> = props => {
    const store = useStore()
    const mappedProps = mapStoreToProps(store, props)

    return <ObserverWrappedComponent {...props} {...mappedProps} />
  }

  return ConnectComponent
}
