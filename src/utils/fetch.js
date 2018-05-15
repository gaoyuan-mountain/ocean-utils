import axios from 'axios';

let instance = null;

class Http {
  constructor() {
    this.requestInterceptor = null;
    this.responseInterceptor = null;
    this.axios = axios.create({
      withCredentials: true
    });
  }

  setDefaultConfig(configKey, configValue) {
    this.axios.defaults[configKey] = configValue;
  }

  setRequestInterceptor(successInterceptor, errorInterceptor) {
    if (typeof successInterceptor !== 'function' || typeof errorInterceptor !== 'function') {
      console.log('setRequestInterceptor: 传入参数必须是funciton');
      return;
    }
    this.axios.interceptors.request.use(successInterceptor, errorInterceptor);
  }

  setResponseInterceptor(successInterceptor, errorInterceptor) {
    if (typeof successInterceptor !== 'function' || typeof errorInterceptor !== 'function') {
      console.log('setResponseInterceptor: 传入参数必须是funciton');
      return;
    }
    this.axios.interceptors.response.use(successInterceptor, errorInterceptor);
  }

  static getInstance() {
    if (!instance) {
      return new Http();
    }
    return instance;
  }
}

export default Http.getInstance();
