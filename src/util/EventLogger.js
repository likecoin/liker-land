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

export async function setTrackerUser(vue, { user, email }) {
  if (window.doNotTrack || navigator.doNotTrack) return;
  try {
    if (vue.$gtag) {
      let hashedId = await digestMessage(user);
      hashedId = hexString(hashedId);
      vue.$gtag.set({ userId: hashedId });
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

export function updateCrispUser(vue, { user, crispToken, displayName, email }) {
  if (vue.crisp) {
    const { $crisp } = window;
    if (displayName) $crisp.push(['set', 'user:nickname', [displayName]]);
    if (email) {
      const emailPayload = [email];
      if (crispToken) emailPayload.push(crispToken);
      $crisp.push(['set', 'user:email', emailPayload]);
    }
  }
}

export function logTrackerEvent(vue, category, action, label, value) {
  try {
    if (vue.$crisp) {
      vue.$crisp.push([
        'set',
        'session:event',
        [[[`liker-land_${action}`, { label }]]],
      ]);
    }
    // do not track
    if (window.doNotTrack || navigator.doNotTrack) return;
    if (vue.$gtag) {
      vue.$gtag.event(action, {
        event_category: category,
        event_label: label.substring(0, 499),
        value,
      });
    }
  } catch (err) {
    console.error('logging error:'); // eslint-disable-line no-console
    console.error(err); // eslint-disable-line no-console
  }
}

export function logPurchaseFlowEvent(
  vue,
  event,
  { txHash, name, price, currency = 'LIKE', classId }
) {
  try {
    if (
      ![
        'view_item',
        'begin_checkout',
        'add_shipping_info',
        'purchase',
      ].includes(event)
    ) {
      throw new Error('Not purchase event');
    }
    if (window.doNotTrack || navigator.doNotTrack) return;
    if (vue.$gtag) {
      vue.$gtag.event(event, {
        transaction_id: txHash,
        value: price,
        items: [
          {
            item_id: classId,
            item_name: name,
            currency,
            price,
            quantity: 1,
          },
        ],
      });
    }
  } catch (err) {
    console.error('logging error:'); // eslint-disable-line no-console
    console.error(err); // eslint-disable-line no-console
  }
}

export default logTrackerEvent;
