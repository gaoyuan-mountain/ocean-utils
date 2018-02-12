import { applyMiddleware, createStore, combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { injectorSaga } from '../utils/saga';

const configStore = (initialState = {}, rootReducer, rootSaga) => {
  const sagaMiddleware = createSagaMiddleware();
  const reducer = combineReducers({ ...rootReducer });

  const createStoreWithMiddleware = applyMiddleware(sagaMiddleware)(createStore);

  const store = createStoreWithMiddleware(reducer, initialState);
  sagaMiddleware.run(rootSaga);

  return store;
};

const configEmptyStore = (initialState = {}) => {
  const sagaMiddleware = createSagaMiddleware();

  const createStoreWithMiddleware = applyMiddleware(sagaMiddleware)(createStore);

  const store = createStoreWithMiddleware(
    () => {},
    initialState
  );

  store.asyncReducers = {};

  sagaMiddleware.run(injectorSaga);

  return store;
};

export {
  configStore,
  configEmptyStore,
};
