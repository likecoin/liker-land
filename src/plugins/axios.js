import HttpAgent, { HttpsAgent } from 'agentkeepalive';

export default function(ctx, inject) {
  let options = {
    timeout: 30000,
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
}
