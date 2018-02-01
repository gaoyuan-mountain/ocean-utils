## configStore(env)(initialState, rootReducer, rootSaga)
- 生成store，env要求development/production

examples：
```javascript
export default configStore(process.env.NODE_ENV)({}, reducer, saga);
```

## fetch
- 与 axios 一致

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

### helper/createSaga
- 生成saga

```javascript
function createSaga(configs, actionType)
```

- configs是数组，包含promise和payload，promise是要异步执行的方法。payload时得到response以后adapter。promise.all得到了返回会依次作为入参传给payload方法。

- actionType是在成功/失败以后触发的事件类型

examples:
```javascript
const login = createSaga([{
  promise: authService.login,
  payload: payload => payload,
}], LOGIN);
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
