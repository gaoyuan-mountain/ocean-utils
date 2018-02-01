import { takeEvery, put, call, all } from 'redux-saga/effects';

export function createReducer(initialState: Object, handlers: Object) {
  return (state: Object = initialState, action: Object) => {
    if ({}.hasOwnProperty.call(handlers, action.type)) {
      return handlers[action.type](state, action);
    }

    return state;
  };
}

export function actionGenerator(key) {
  return {
    ACTION: key,
    SUCCESS: `${key}_SUCCESS`,
    FAILED: `${key}_FAILED`
  };
}

export function createSaga(configs, actionType) {
  function* sagaAction(action) {
    try {
      const promises = configs.map((config) => call(config.promise));
      const responses = yield all(promises);
      const payload = {};
      responses.map((response, index) => {
        Object.assign(payload, configs[index].payload(response));
      });

      yield put({
        type: actionType.SUCCESS,
        payload,
      });

      if (action.payload && action.payload.callback) {
        action.payload.callback();
      }
    } catch (error) {
      yield put({
        type: 'ERROR',
        payload: {
          error,
          message: '获取活动列表失败',
        },
      });
    }
  }

  return function* sagaActionWatch() {
    yield takeEvery(actionType.ACTION, sagaAction);
  };
}
