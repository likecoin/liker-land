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

export async function setLoggerUser(vue, { wallet, method }) {
  if (window.doNotTrack || navigator.doNotTrack) return;
  try {
    if (vue.$gtag) {
      let hashedId = await digestMessage(wallet);
      hashedId = hexString(hashedId);
      vue.$gtag.set({ userId: hashedId });
      // HACK: use .set to mitigate connected site user_id issue
      // https://support.google.com/analytics/answer/9973999?hl=en
      // vue.$gtag.config({ user_id: hashedId });
      vue.$gtag.set({ user_id: hashedId });
      vue.$gtag.event('login', { method });
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

export function logTrackerEvent(vue, category, action, label, value) {
  try {
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
  { txHash, name, price, currency, classId }
) {
  try {
    if (
      ![
        'view_item',
        'begin_checkout',
        'add_shipping_info',
        'add_to_cart',
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
        currency,
        items: [
          {
            item_id: classId,
            item_name: name,
            item_brand: 'Writing NFT',
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
