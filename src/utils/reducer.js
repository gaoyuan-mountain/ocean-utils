import { combineReducers } from 'redux';

export function makeAllReducer(asyncReducers) {
  return combineReducers({
    ...asyncReducers
  });
}

export function injectReducer(store, { key, reducer }) {
  if (Object.hasOwnProperty.call(store.asyncReducers, key)) return;

  store.asyncReducers[key] = reducer;
  store.replaceReducer(makeAllReducer(store.asyncReducers));
}
