import * as React from "react"
import { connectReduxDevtools } from "mst-middlewares"

import { createStore } from "../stores/createStore"
import { StoreProvider } from "./StoreProvider"
import App from "./App"

const rootStore = createStore()

connectReduxDevtools(require("remotedev"), rootStore)

const Root: React.FunctionComponent<{}> = () => (
  <StoreProvider value={rootStore}>
    <App />
  </StoreProvider>
)

export default Root
