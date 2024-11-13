/* eslint-disable no-underscore-dangle */

class GoogleRetailPixel {
  userId;
  visitorId;
  apiKey;
  projectId;

  constructor(apiKey, projectId) {
    this.apiKey = apiKey;
    this.projectId = projectId;
    window._gre = window._gre || [];
    window._gre.push(['apiKey', apiKey]);
    window._gre.push(['projectId', projectId]);
    window._gre.push(['locationId', 'global']);
    window._gre.push(['catalogId', 'default_catalog']);
  }

  setUserId(userId) {
    this.userId = userId;
  }

  setVisitorId(visitorId) {
    this.visitorId = visitorId;
  }

  logEvent(eventType, payload = {}, { attributionToken, experimentIds } = {}) {
    if (!this.visitorId) {
      return;
    }
    const event = {
      eventType,
      attributionToken,
      experimentIds,
      visitorId: this.visitorId,
      userInfo: this.userId
        ? {
            userId: this.userId,
          }
        : undefined,
      ...payload,
    };
    // HACK: cloud_retail does not replace _gre on init
    // cloud_retail only calls logEvent once on _gre and
    // it does not even clear _gre after that
    if (window.cloud_retail) {
      window.cloud_retail.logEvent([
        ['apiKey', this.apiKey],
        ['projectId', this.projectId],
        ['locationId', 'global'],
        ['catalogId', 'default_catalog'],
        ['logEvent', event],
      ]);
    } else {
      window._gre.push(['logEvent', event]);
    }
  }
}

export default (ctx, inject) => {
  if (process.env.GRE_API_KEY && process.env.GRE_PROJECT_ID) {
    const gre = new GoogleRetailPixel(
      process.env.GRE_API_KEY,
      process.env.GRE_PROJECT_ID
    );
    const d = document;
    const s = d.createElement('script');
    s.src = 'https://www.gstatic.com/retail/v2_event.js';
    s.async = 1;
    d.getElementsByTagName('head')[0].appendChild(s);

    inject('gre', gre);
  }
};
