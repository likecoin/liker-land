/*
  HACK: force set google-optimize params for gtag config
*/
const { GA_TRACKING_ID } = process.env;

export default ({ app }) => {
  if (app.$exp && app.$gtag) {
    const { experimentID, $variantIndexes } = app.$exp;
    if (!experimentID || !$variantIndexes || !$variantIndexes.length) return;
    if (app.$gtag) {
      app.$gtag.config(GA_TRACKING_ID, {
        experiments: [{ id: experimentID, variant: $variantIndexes.join('-') }],
      });
    }
  }
};
