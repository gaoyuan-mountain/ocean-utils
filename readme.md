## storeHelper
- 生成store，env要求development/production

examples：
```javascript
import { storeHelper } from 'ocean-utils';

export default storeHelper(process.env.NODE_ENV).configEmptyStore({});
```

## fetch
- 对axios的封装
- import { fetch } from 'ocean-utils'
- fetch.axios 与 axios 一致
- http.setRequestInterceptor(successFn, errorFn)、http.setResponseInterceptor(successFn, errorFn)可以设置拦截器，建议在项目入口设置一次就可以
- example：
```javascript
http.setResponseInterceptor(
  res => {
    if (res.data.code !== 1) {
      throw new Error(res);
    } else {
      return res.data.data;
    }
  },
  error => {
    throw Error(error);
  }
)
```

## helper
### helper/actionGenerator
- 生成actionType对象
examples:
```javascript
export const ACTIVITY_LIST = actionGenerator('ACTIVITY_LIST');
```
get:
```javascript
{
  ACTION: 'ACTIVITY_LIST',
  SUCCESS: 'ACTIVITY_LIST_SUCCESS',
  FAILED: 'ACTIVITY_LIST_FAILED'
}
```

### sagaHelper
- 生成saga

```javascript
function createSaga(configs, actionType)
```

- configs是数组，包含promise和payload，promise是要异步执行的方法。payload时得到response以后adapter。promise.all得到了返回会依次作为入参传给payload方法。

- actionType是在成功/失败以后触发的事件类型

examples:
```javascript
const login = sagaHelper.createSaga([{
  promise: authService.profile,
  payload: payload => ({profile: payload}),
}], PROFILE);
```

- 同步逻辑
examples：
```javascript
const login = sagaHelper.createSyncSaga(PROFILE);
```

## message  简单的事件队列，多用于child app之间通讯
### message/MsgRegister  注册事件
examples:

```javascript
MsgRegister('EVENT:TOGGLE_MENU', this.toggleMenu);
```

### message/MsgUnregister  取消注册

```javascript
MsgUnregister('EVENT:TOGGLE_MENU', this.toggleMenu);
```


### message/MsgTrigger  触发事件

```javascript
MsgTrigger('EVENT:TOGGLE_MENU');
```

### Lazyload
```javascript
import { Lazyload } from 'ocean-utils';

const createComponent = (component) => {
  return () => {
    const AsyncComponent = (
      <Lazyload load={component}>
        {
          (Async) => {
            return Async ? <Async /> : <Loading />;
          }
        }
      </Lazyload>
    );
    return AsyncComponent;
  };
};

<Route path="/solution/result/:id" component={createComponent(Solution)} exact />
```
