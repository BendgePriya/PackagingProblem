import React, { Component } from 'react';
import logo from './logo.svg';
import Layout from './components/Layout'
import './App.css';
import thunk from 'redux-thunk'
import { composeWithDevTools } from "redux-devtools-extension"
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import allReducers from "./reducers/index"

const store = createStore(allReducers, {}, composeWithDevTools(applyMiddleware(thunk)))

class App extends Component {
  render() {
    return (
      <Provider store={store}>
      <div className="App">
        <Layout/>
      </div>
      </Provider>
    );
  }
}

export default App;
