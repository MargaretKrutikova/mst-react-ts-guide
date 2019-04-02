import * as React from "react"
import { StoreProvider } from "./StoreProvider"
import { createStore } from "./stores/createStore"
import App from "./components/App"

const rootStore = createStore()

const Root: React.FunctionComponent<{}> = () => (
  <StoreProvider value={rootStore}>
    <App />
  </StoreProvider>
)

export default Root
