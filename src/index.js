import "babel-polyfill"
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { HashRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './store'

const render = ()=>{
  ReactDOM.render(
    <Provider store={store}>
      <HashRouter >
        <App store={store} />
      </HashRouter>
    </Provider>
    , document.getElementById('root')
  )
}

render()
store.subscribe(render)

/*
if (module.hot) {
  module.hot.accept()
}*/