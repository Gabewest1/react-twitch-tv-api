import React from 'react'
import ReactDOM from 'react-dom'
import App from "./containers/App"
import createHistory from "history/createBrowserHistory"
import { Provider } from "react-redux"
import { ConnectedRouter } from "react-router-redux"
import createStoreWithHistory from "./store"
import './index.css'

const history = createHistory()
const store = createStoreWithHistory(history)

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App />
    </ConnectedRouter>
  </Provider>
   
  , document.getElementById('root')
)
