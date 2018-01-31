import { applyMiddleware, createStore, combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';

const configStore = (initialState = {}, rootReducer, rootSaga) => {
  const sagaMiddleware = createSagaMiddleware();
  const reducer = combineReducers({ ...rootReducer });

  const createStoreWithMiddleware = applyMiddleware(sagaMiddleware)(createStore);

  const store = createStoreWithMiddleware(reducer, initialState);
  sagaMiddleware.run(rootSaga);

  return store;
};

export default configStore;
