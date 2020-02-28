import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import createSagaMiddleware from "redux-saga";
import App from "./App";
import { chartReducer } from "./chart/redux/chart.reducer";
import "./index.css";
import * as serviceWorker from "./serviceWorker";

const sagaMiddleware = createSagaMiddleware();

export const rootReducer = combineReducers({
  chart: chartReducer,
});

// @ts-ignore
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// @ts-ignore
function configureStore(preloadedState) {
  const middlewareEnhancer = applyMiddleware(sagaMiddleware);
  const store = createStore(rootReducer, preloadedState, composeEnhancers(middlewareEnhancer));
  return store;
}

const store = configureStore({});

// TODO add sagas
// sagaMiddleware.run(chartSagas);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);

serviceWorker.unregister();
