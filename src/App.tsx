import * as React from "react"
import { StoreProvider } from "./StoreProvider"
import { createStore } from "./stores/createStore"

import "./App.css"

const rootStore = createStore()

const App: React.FunctionComponent<{}> = () => (
  <StoreProvider value={rootStore}>
    <div className="App">
      <header className="App-header">Poll Maker</header>
    </div>
  </StoreProvider>
)

export default App
