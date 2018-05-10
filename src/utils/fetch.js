import axios from 'axios';

// 防xsrf攻击，要在request header设置相关header
axios.defaults.xsrfCookieName = 'csrfToken';
axios.defaults.xsrfHeaderName = 'x-csrf-token';

// 设置响应拦截器统一处理错误
axios.interceptors.response.use(
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
);

// 设置请求拦截器, jwt
// axios.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');

//   if (token && !config.url.includes('login')) {
//     // [TODO] 跨域需要带cookie
//     // config.withCredentials = true;
//     config.headers = {
//       ...config.headers,
//       Authorization: token
//     };
//   }
//   return config;
// });

export default axios;
