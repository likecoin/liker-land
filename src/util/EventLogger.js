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
    if (window.FB && window.FB.AppEvents)
      window.FB.AppEvents.logEvent(action, value, { label });
    if (window.fbq) window.fbq('track', action);
  } catch (err) {
    console.error('logging error:'); // eslint-disable-line no-console
    console.error(err); // eslint-disable-line no-console
  }
}

export default logTrackerEvent;
