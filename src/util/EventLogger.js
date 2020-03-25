export function logTrackerEvent(vue, category, action, label, value) {
  try {
    if (vue.$intercom)
      vue.$intercom.trackEvent(`liker-land_${action}`, { label });
    // do not track
    if (window.doNotTrack || navigator.doNotTrack) return;
    if (vue.$ga) {
      vue.$ga.event({
        eventCategory: category,
        eventAction: action,
        eventLabel: label.substring(0, 499),
        eventValue: value,
      });
    }
    if (window.fbq) {
      const eventName = `LikerLand${category}_${action}`;
      const eventPayload = {
        label: label.substring(0, 499),
      };
      if (eventName === 'LikerLandCivic_CivicPaymentSuccess') {
        eventPayload.currency = 'USD';
        eventPayload.value = 5;
      }
      window.fbq('trackCustom', eventName, eventPayload);
    }
  } catch (err) {
    console.error('logging error:'); // eslint-disable-line no-console
    console.error(err); // eslint-disable-line no-console
  }
}

export default logTrackerEvent;
