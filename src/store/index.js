import configureStoreDev from './configureStore.dev';
import configureStoreProd from './configureStore.prod';

export default function configStore(env) {
  if (env === 'production' || env === 'test') {
    return configureStoreProd;
  } else {
    return configureStoreDev;
  }
}
