import { applyMiddleware, createStore, compose, combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';
import logger from 'redux-logger';
import { injectorSaga } from '../utils/saga';

const configStore = (initialState = {}, rootReducer, rootSaga) => {
  const reducer = combineReducers({
    ...rootReducer
  });
  const sagaMiddleware = createSagaMiddleware();

  const createStoreWithMiddleware = compose(
    applyMiddleware(sagaMiddleware, logger)
  )(createStore);

  const store = createStoreWithMiddleware(
    reducer,
    initialState
  );

  sagaMiddleware.run(rootSaga);

  return store;
};

const configEmptyStore = (initialState = {}) => {
  const sagaMiddleware = createSagaMiddleware();

  const createStoreWithMiddleware = compose(
    applyMiddleware(sagaMiddleware, logger)
  )(createStore);

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
