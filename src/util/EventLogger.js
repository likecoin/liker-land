import { IS_TESTNET } from '../constant';

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

export function resetLoggerUser(vue) {
  if (vue.$sentry) {
    vue.$sentry.setUser({});
  }
  if (vue.$gtag) {
    vue.$gtag.set({ userId: null });
    vue.$gtag.set({ user_id: null });
  }
  if (vue.$crisp) {
    vue.$crisp.push(['do', 'session:reset']);
  }
}

export async function setLoggerUser(
  vue,
  { wallet, method, event = 'restore' }
) {
  if (vue.$sentry) {
    const opt = {
      id: wallet,
      username: wallet,
    };
    vue.$sentry.setUser(opt);
  }
  try {
    if (vue.$gtag) {
      if (!window.doNotTrack && !navigator.doNotTrack) {
        let hashedId = await digestMessage(wallet);
        hashedId = hexString(hashedId);
        vue.$gtag.set({ userId: hashedId });
        // HACK: use .set to mitigate connected site user_id issue
        // https://support.google.com/analytics/answer/9973999?hl=en
        // vue.$gtag.config({ user_id: hashedId });
        vue.$gtag.set({ user_id: hashedId });
      }
      if (event === 'signup') {
        vue.$gtag.event('sign_up', { method });
      } else if (event === 'login') {
        vue.$gtag.event('login', { method });
      }
    }
    if (vue.$crisp) {
      vue.$crisp.push(['set', 'session:data', [[['wallet', wallet]]]]);
      vue.$crisp.push(['set', 'session:data', [[['login_method', method]]]]);
    }
  } catch (err) {
    console.error(err); // eslint-disable-line no-console
  }
}

export function updateLoggerUserInfo(vue, { wallet, displayName, email }) {
  if (vue.$sentry) {
    const opt = {
      id: wallet,
      username: displayName || wallet,
      email,
    };
    vue.$sentry.setUser(opt);
  }
  if (vue.$crisp) {
    vue.$crisp.push(['set', 'session:data', [[['wallet', wallet]]]]);
    if (displayName) {
      vue.$crisp.push(['set', 'user:nickname', [displayName || wallet]]);
    }
    if (email) {
      vue.$crisp.push(['set', 'user:email', [email]]);
    }
  }
}

export function logTrackerEvent(
  vue,
  category,
  action,
  label = '',
  value = 1,
  otherPayload = {}
) {
  try {
    // do not track
    if (window.doNotTrack || navigator.doNotTrack) return;
    if (vue.$gtag) {
      vue.$gtag.event(action?.substring(0, 40), {
        event_category: category?.substring(0, 100),
        event_label: label?.substring(0, 100),
        value,
        ...otherPayload,
      });
    }
    if (vue.$crisp) {
      if (action === 'nft_free_nft_book_purchased') {
        vue.$crisp.push(['set', 'session:segments', [['free book']]]);
      }
      vue.$crisp.push([
        'set',
        'session:event',
        [[[action, { category, action, label, value, ...otherPayload }]]],
      ]);
    }
  } catch (err) {
    console.error('logging error:'); // eslint-disable-line no-console
    console.error(err); // eslint-disable-line no-console
  }
}

export function logPurchaseFlowEvent(
  vue,
  event,
  { txHash, price, currency, items, isNFTBook }
) {
  try {
    if (
      ![
        'view_item',
        'view_cart',
        'begin_checkout',
        'add_shipping_info',
        'add_to_cart',
        'remove_from_cart',
        'purchase',
      ].includes(event)
    ) {
      throw new Error('Not purchase event');
    }
    if (vue.$gtag) {
      vue.$gtag.event(event, {
        transaction_id: txHash,
        value: price,
        currency,
        items: items.map(i => {
          const itemId = i.productId || i.collectionId || i.classId;
          return {
            item_id: itemId,
            item_name: i.name?.substring(0, 100) || itemId,
            item_brand: isNFTBook ? 'NFT Book' : 'Writing NFT',
            currency,
            price: i.price,
            quantity: i.quantity || 1,
          };
        }),
      });
    }
    if (window.fbq && !IS_TESTNET) {
      const eventNameMapping = {
        view_item: 'ViewContent',
        begin_checkout: 'InitiateCheckout',
        add_to_cart: 'AddToCart',
        purchase: 'Purchase',
      };
      if (eventNameMapping[event]) {
        window.fbq('track', eventNameMapping[event], {
          currency,
          value: price,
          content_ids: items.map(
            i => i.productId || i.collectionId || i.classId
          ),
        });
      }
    }
    if (vue.$crisp) {
      vue.$crisp.push([
        'set',
        'session:event',
        [
          [
            [
              event,
              {
                price,
                currency,
                items: JSON.stringify(
                  items.map(i => i.productId || i.collectionId || i.classId)
                ),
              },
            ],
          ],
        ],
      ]);
      if (event === 'purchase') {
        vue.$crisp.push(['set', 'session:segments', [['purchaser']]]);
      }
    }
  } catch (err) {
    console.error('logging error:'); // eslint-disable-line no-console
    console.error(err); // eslint-disable-line no-console
  }
}

export function logPurchaseNFTBookEvent(
  vue,
  { name, price, currency, classId, collectionId, quantity = 1 }
) {
  try {
    if (vue.$gtag) {
      vue.$gtag.event('purchase_nft_book', {
        value: price,
        currency,
        items: [
          {
            item_id: collectionId || classId,
            item_name: name?.substring(0, 100),
            item_brand: 'NFT Book',
            currency,
            price,
            quantity,
          },
        ],
      });
    }
    if (window.fbq && !IS_TESTNET) {
      window.fbq('trackCustom', 'PurchaseBook', {
        currency,
        value: price,
        quantity,
        content_ids: [collectionId || classId],
      });
    }
    if (vue.$crisp) {
      vue.$crisp.push([
        'set',
        'session:event',
        [
          [
            [
              'purchase_nft_book',
              { name, price, currency, classId, collectionId, quantity },
            ],
          ],
        ],
      ]);
    }
  } catch (err) {
    console.error('logging error:'); // eslint-disable-line no-console
    console.error(err); // eslint-disable-line no-console
  }
}

export default logTrackerEvent;
