import { takeEvery, takeLatest, throttle, take, fork, cancel, put, call, all } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';

export function createSaga(configs, actionType, effect = 'takeEvery', throttleSecond = 500) {
  function *sagaAction(action) {
    try {
      const promises = configs.map((config) => call(config.promise, action.payload));
      const responses = yield all(promises);
      let payload = {};
      responses.map((response, index) => {
        payload = Object.assign(payload, configs[index].payload(response));
        return payload;
      });

      yield put({
        type: actionType.SUCCESS,
        payload,
      });

      if (action.payload && action.payload.callback) {
        action.payload.callback(payload);
      }
    } catch (error) {
      yield put({
        type: 'ERROR',
        payload: {
          error,
          message: '',
        },
      });
    }
  }

  return function *sagaActionWatch() {
    switch (effect) {
      case 'takeLatest':
        yield takeLatest(actionType.ACTION, sagaAction);
        break;
      case 'throttle':
        yield throttle(throttleSecond, actionType.ACTION, sagaAction);
        break;
      default:
      yield takeEvery(actionType.ACTION, sagaAction);
    }
  };
}

export function createSyncSaga(actionType) {
  function *sagaSyncAction(action) {
    try {
      const { callback, ...restParams } = action.payload || {};
      yield put({
        type: actionType.SUCCESS,
        payload: restParams
      });

      if (callback) {
        action.payload.callback(restParams);
      }
    } catch (error) {
      yield put({
        type: 'ERROR',
        payload: {
          error,
          message: '',
        },
      });
    }
  }

  return function *sagaSyncActionWatch() {
    yield takeEvery(actionType.ACTION, sagaSyncAction);
  };
}

/** saga injector */
let globalAppendEmmit = null;
let globalRemoveEmmit = null;

const injectedSagas = {};

const DEFAULT_OPTIONS = {
  hold: false,
  replace: true,
  force: false,
  sagaProps: {},
};

export function removeSaga(sagaName) {
  const { hold } = (injectedSagas[sagaName] || {}).options || {};
  if (!hold) {
    globalRemoveEmmit({ sagaName });
  }
}

export function injectSagas(params) {
  Object.keys(params).forEach(sagaName => {
    const onlySaga = typeof params[sagaName] === 'function';
    const mergeSaga = onlySaga ? params[sagaName] : params[sagaName].saga;
    const mergeOptions = onlySaga ? DEFAULT_OPTIONS : { ...DEFAULT_OPTIONS, ...params[sagaName].options };
    const { force, replace, sagaProps } = mergeOptions;
    const existSaga = Boolean(injectedSagas[sagaName]);
    if (replace && existSaga) {
      globalRemoveEmmit({ sagaName });
    }
    if (!existSaga || force) {
      globalAppendEmmit({ sagaName, mergeSaga, sagaProps, mergeOptions });
    }
  });
}

function *watchAppendSaga() {
  const chan = yield call(() => {
    return eventChannel(emmit => {
      globalAppendEmmit = emmit;
      return f => f;
    });
  });
  while (true) {
    const { sagaName, mergeSaga, sagaProps, mergeOptions } = yield take(chan);
    injectedSagas[sagaName] = {
      saga: mergeSaga,
      options: mergeOptions,
    };
    injectedSagas[sagaName].sagaLink = yield fork(mergeSaga, sagaProps);
  }
}

function *watchRemoveSaga() {
  const chan = yield call(() =>
    eventChannel(emmit => {
      globalRemoveEmmit = emmit;
      return f => f;
    }),
  );
  while (true) {
    const { sagaName } = yield take(chan);
    yield cancel(injectedSagas[sagaName].sagaLink);
    injectedSagas[sagaName] = null;
  }
}

export function *injectorSaga() {
  yield all([watchAppendSaga(), watchRemoveSaga()]);
}
