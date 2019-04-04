import * as React from "react"
import { StoreProvider } from "./StoreProvider"
import { createStore } from "../stores/createStore"
import { connectReduxDevtools } from "mst-middlewares"

import App from "./App"

const rootStore = createStore()

connectReduxDevtools(require("remotedev"), rootStore)

const Root: React.FunctionComponent<{}> = () => (
  <StoreProvider value={rootStore}>
    <App />
  </StoreProvider>
)

export default Root
