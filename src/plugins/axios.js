import HttpAgent, { HttpsAgent } from 'agentkeepalive';

export default (ctx, inject) => {
  let options = {
    timeout: 60000,
  };
  if (process.server) {
    options = {
      ...options,
      httpAgent: new HttpAgent(),
      httpsAgent: new HttpsAgent(),
    };
  }
  const instance = ctx.$axios.create(options);
  ctx.$api = instance;
  inject('api', instance);
};
