import { takeEvery, take, fork, cancel, put, call, all } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';

export function createSaga(configs, actionType) {
  function *sagaAction(action) {
    try {
      const promises = configs.map((config) => call(config.promise));
      const responses = yield all(promises);
      const payload = {};
      responses.map((response, index) => {
        return Object.assign(payload, configs[index].payload(response));
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

  return function *sagaActionWatch() {
    yield takeEvery(actionType.ACTION, sagaAction);
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
