import React, { Component } from 'react';
import Layout from '../src/app/components/Layout'
import './App.css';
import thunk from 'redux-thunk'
import { composeWithDevTools } from "redux-devtools-extension"
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import allReducers from "../src/app/reducers/index"


/**
 * I am using REDUX library for managing package state 
 * so that it can be accessible by either parent or child components.
 * I used REDUX for enhancing the capablities of this application
 */

// creating a store so that we can save application state globally
const store = createStore(allReducers, {}, composeWithDevTools(applyMiddleware(thunk)))

// This class is the entry point for our application
//where we define layout of application, passing store to the application
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
