const eventStack = {};

/**
 * MsgRegister
 * 注册事件
 * @export
 * @param {string} eventName
 * @param {func} callback
 */
export function MsgRegister(eventName, callback) {
  if (!eventStack[eventName]) {
    eventStack[eventName] = [];
  }
  eventStack[eventName].push(callback);
}

/**
 * MsgUnregister
 * 撤销事件绑定
 * @export
 * @param {string} eventName
 * @param {func} callback
 */
export function MsgUnregister(eventName, callback) {
  if (!callback) {
    delete eventStack[eventName];
  } else if (eventStack[eventName]) {
    eventStack[eventName] = eventStack[eventName].map((_callback) => {
      return _callback !== callback;
    });
    if (eventStack[eventName].length === 0) {
      delete eventStack[eventName];
    }
  }
}

/**
 * MsgTrigger
 * 触发事件
 * @export
 * @param {string} eventName
 * @returns null
 */
export function MsgTrigger(eventName) {
  if (!eventStack[eventName]) {
    return null;
  }
  eventStack[eventName].map((callback) => {
    return callback();
  });
}
