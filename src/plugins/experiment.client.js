/*
  HACK: force set google-optimize params for gtag config
*/
export default ({ app }) => {
  if (app.$exp && app.$gtag) {
    const { experimentID, $variantIndexes } = app.$exp;
    if (!experimentID || !$variantIndexes || !$variantIndexes.length) return;
    if (app.$gtag && window && window.gtag) {
      app.$gtag.config({
        experiments: [{ id: experimentID, variant: $variantIndexes.join('-') }],
      });
    }
  }
};
