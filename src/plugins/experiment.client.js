/*
  HACK: vue-analytics might not have inited window.ga early enough for google-optimize
  set exp value explicitly in vue.$exp here
*/
export default ({ app }) => {
  if (app.$exp && app.$gtag) {
    const { experimentID, $variantIndexes } = app.$exp;
    if (!experimentID || !$variantIndexes || !$variantIndexes.length) return;
    const expCookie = `${experimentID}.${$variantIndexes.join('-')}`;
    if (app.$gtag) app.$gtag.set('exp', expCookie);
  }
};
