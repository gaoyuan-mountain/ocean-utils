import { applyMiddleware, createStore, compose, combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';
import logger from 'redux-logger';

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

export default configStore;
