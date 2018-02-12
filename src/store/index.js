import * as configureStoreDev from './configureStore.dev';
import * as configureStoreProd from './configureStore.prod';

export default function configStore(env) {
  if (env === 'production' || env === 'test') {
    return configureStoreProd;
  }
  return configureStoreDev;
}
