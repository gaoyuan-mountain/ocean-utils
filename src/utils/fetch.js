import axios from 'axios';

let instance = null;

class Http {
  constructor() {
    this.requestInterceptor = null;
    this.responseInterceptor = null;
    this.axios = axios;

    this.axios.defaults.xsrfCookieName = 'csrfToken';
    this.axios.defaults.xsrfHeaderName = 'x-csrf-token';
    this.axios.defaults.withCredentials = true;
  }

  setDefaultConfig(configKey, configValue) {
    this.axios.defaults[configKey] = configValue;
  }

  setRequestInterceptor(interceptor) {
    if (typeof interceptor !== 'function') {
      console.log('setRequestInterceptor: 传入参数必须是funciton');
      return;
    }
    this.requestInterceptor = interceptor;
    this.axios.interceptors.request.use(interceptor);
  }

  setResponseInterceptor(interceptor) {
    if (typeof interceptor !== 'function') {
      console.log('setRequestInterceptor: 传入参数必须是funciton');
      return;
    }
    this.responseInterceptor = interceptor;
    this.axios.interceptors.response.use(interceptor);
  }

  static getInstance() {
    if (!instance) {
      return new Http();
    }
    return instance;
  }
}

export default Http.getInstance();
