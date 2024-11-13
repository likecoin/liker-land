import { IS_TESTNET, AD_CONVERSION_ID, FACEBOOK_PIXEL_ID } from '../constant';

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

function hasDoNotTrack() {
  return window.doNotTrack || navigator.doNotTrack;
}

export async function getHashedUserId(wallet) {
  let hashedId = await digestMessage(wallet);
  hashedId = hexString(hashedId);
  return hashedId;
}

export function resetLoggerUser(vue) {
  if (vue.$sentry) {
    vue.$sentry.setUser({});
  }
  if (vue.$gre) {
    vue.$gre.setUserId(null);
  }
  if (vue.$gtag) {
    vue.$gtag.set({ userId: null });
    vue.$gtag.set({ user_id: null });
  }
  if (vue.$fb && FACEBOOK_PIXEL_ID) {
    vue.$fb.init(FACEBOOK_PIXEL_ID);
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
    let hashedId = await digestMessage(wallet);
    hashedId = hexString(hashedId);
    if (vue.$gre) {
      vue.$gre.setUserId(hashedId);
    }
    if (vue.$gtag) {
      if (event === 'signup') {
        vue.$gtag.event('sign_up', { method });
      } else if (event === 'login') {
        vue.$gtag.event('login', { method });
      }
    }
    if (vue.$gtag) {
      vue.$gtag.set({ userId: hashedId });
      // HACK: use .set to mitigate connected site user_id issue
      // https://support.google.com/analytics/answer/9973999?hl=en
      // vue.$gtag.config({ user_id: hashedId });
      vue.$gtag.set({ user_id: hashedId });
    }
    if (vue.$fb && FACEBOOK_PIXEL_ID) {
      vue.$fb.init(FACEBOOK_PIXEL_ID, {
        external_id: wallet,
      });
    }
    if (vue.$crisp) {
      vue.$crisp.push(['set', 'session:data', [[['like_wallet', wallet]]]]);
      vue.$crisp.push(['set', 'session:data', [[['login_method', method]]]]);
    }
  } catch (err) {
    console.error(err); // eslint-disable-line no-console
  }
}

export function updateLoggerUserInfo(
  vue,
  { wallet, displayName, email, crispToken }
) {
  if (vue.$sentry) {
    const opt = {
      id: wallet,
      username: displayName || wallet,
      email,
    };
    vue.$sentry.setUser(opt);
  }
  if (!hasDoNotTrack()) {
    if (vue.$gtag) {
      if (email) vue.$gtag.set('user_data', { email });
    }
    if (vue.$fb && FACEBOOK_PIXEL_ID) {
      vue.$fb.init(FACEBOOK_PIXEL_ID, {
        em: email,
        external_id: wallet,
      });
    }
  }
  if (vue.$crisp) {
    if (email) {
      vue.$crisp.push(['set', 'user:email', [email, crispToken]]);
    }
    if (wallet) {
      vue.$crisp.push(['set', 'session:data', [[['like_wallet', wallet]]]]);
    }
    if (displayName) {
      vue.$crisp.push(['set', 'user:nickname', [displayName || wallet]]);
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

export function logRetailEvent(vue, eventType, payload) {
  try {
    if (vue.$gre) {
      if (!vue.$gre.visitorId) {
        // HACK: query in gtag if no visitor Id
        // multiple concurrent queries might occur
        // if logRetailEvent is called multiple times
        // but all should yield same result anyway
        if (vue.$gtag && process.env.GA_TRACKING_ID) {
          vue.$gtag.query(
            'get',
            process.env.GA_TRACKING_ID,
            'client_id',
            id => {
              vue.$gre.setVisitorId(id);
              vue.$gre.logEvent(eventType, payload);
            }
          );
        }
      } else {
        vue.$gre.logEvent(eventType, payload);
      }
    }
  } catch (err) {
    console.error('logging error:'); // eslint-disable-line no-console
    console.error(err); // eslint-disable-line no-console
  }
}

export function logPurchaseFlowEvent(
  vue,
  event,
  { txHash, price, currency, items, isNFTBook, paymentId, ...otherPayload }
) {
  try {
    if (
      ![
        'search',
        'view_item_list',
        'view_item',
        'select_item',
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
        transaction_id: paymentId || txHash,
        value: price,
        currency,
        items: items?.map(i => {
          let itemId = i.productId || i.collectionId || i.classId;
          if (i.priceIndex !== undefined) {
            itemId = `${itemId}-${i.priceIndex}`;
          }
          return {
            item_id: itemId,
            item_name: i.name?.substring(0, 100),
            item_brand: isNFTBook ? 'NFT Book' : 'Writing NFT',
            currency,
            price: i.price,
            quantity: i.quantity || 1,
          };
        }),
        ...otherPayload,
      });
      if (event === 'purchase' && AD_CONVERSION_ID) {
        vue.$gtag.event('conversion', {
          send_to: AD_CONVERSION_ID,
          value: price,
          currency,
          transaction_id: paymentId || txHash,
        });
      }
    }
    if (vue.$fb && FACEBOOK_PIXEL_ID) {
      const eventNameMapping = {
        view_item: 'ViewContent',
        begin_checkout: 'InitiateCheckout',
        add_to_cart: 'AddToCart',
        purchase: 'Purchase',
        search: 'Search',
      };
      if (eventNameMapping[event]) {
        const eventName = eventNameMapping[event];
        const eventID = paymentId ? `${eventName}_${paymentId}` : undefined;
        vue.$fb.track(
          eventName,
          {
            currency,
            value: price,
            order_id: paymentId || txHash,
            content_type: items ? 'product' : undefined,
            contents: items?.map(i => {
              let id = i.productId || i.collectionId || i.classId;
              if (i.priceIndex !== undefined) {
                id = `${id}-${i.priceIndex}`;
              }
              return {
                id,
                quantity: i.quantity || 1,
              };
            }),
            content_ids: items?.map(i => {
              let id = i.productId || i.collectionId || i.classId;
              if (i.priceIndex !== undefined) {
                id = `${id}-${i.priceIndex}`;
              }
              return id;
            }),
          },
          eventID ? { eventID } : undefined
        );
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
                items:
                  items &&
                  JSON.stringify(
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
    if (vue.$fb && FACEBOOK_PIXEL_ID) {
      vue.$fb.query('trackCustom', 'PurchaseBook', {
        currency,
        value: price,
        content_type: 'product',
        contents: [
          {
            id: collectionId || classId,
            quantity: quantity || 1,
          },
        ],
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
