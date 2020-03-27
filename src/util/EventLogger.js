function hexString(buffer) {
  const byteArray = new Uint8Array(buffer);
  const hexCodes = [...byteArray].map(value => {
    const hexCode = value.toString(16);
    const paddedHexCode = hexCode.padStart(2, '0');
    return paddedHexCode;
  });
  return hexCodes.join('');
}

function digestMessage(message) {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  return window.crypto.subtle.digest('SHA-256', data);
}

export async function setTrackerUserId(vue, { user }) {
  if (window.doNotTrack || navigator.doNotTrack) return;
  try {
    if (vue.$ga) {
      let hashedId = await digestMessage(user);
      hashedId = hexString(hashedId);
      vue.$ga.set('userId', hashedId);
    }
  } catch (err) {
    console.error(err); // eslint-disable-line no-console
  }
}

export function updateSentryUser(vue, { user, displayName }) {
  if (user) {
    const opt = {
      id: user,
      username: displayName || user,
    };
    vue.$sentry.configureScope(scope => {
      scope.setUser(opt);
    });
  }
}

export function updateIntercomUser(
  vue,
  { user, intercomToken, displayName, email }
) {
  if (vue.$intercom.booted) {
    const opt = {
      user_id: user,
      user_hash: intercomToken,
      name: displayName || user,
      email,
    };
    vue.$intercom.update(opt);
  }
}

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
