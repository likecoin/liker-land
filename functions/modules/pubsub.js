const { PubSub } = require('@google-cloud/pubsub');
const { v4: uuidv4 } = require('uuid');

const PUBSUB_TOPIC_MISC = 'misc';

const {
  ETH_NETWORK_NAME,
  APP_SERVER,
  GCLOUD_PUBSUB_ENABLE,
  GCLOUD_PUBSUB_MAX_MESSAGES,
  GCLOUD_PUBSUB_MAX_WAIT,
} = process.env;

const topics = [PUBSUB_TOPIC_MISC];
const publisher = {};
const publisherWrapper = {};

const pubsub = new PubSub();
topics.forEach(topic => {
  publisherWrapper[topic] = pubsub.topic(topic, {
    batching: {
      maxMessages: GCLOUD_PUBSUB_MAX_MESSAGES || 10,
      maxMilliseconds: GCLOUD_PUBSUB_MAX_WAIT || 1000,
    },
  });
});

/* istanbul ignore next */
publisher.publish = async (publishTopic, req, obj) => {
  if (!GCLOUD_PUBSUB_ENABLE) return;
  Object.assign(obj, {
    '@timestamp': new Date().toISOString(),
    appServer: APP_SERVER,
    ethNetwork: ETH_NETWORK_NAME,
    uuidv4: uuidv4(),
  });
  if (req) {
    const { 'fastly-client-ip': fastlyClientIp } = req.headers;
    let originalIP;
    Object.assign(obj, {
      requestIP: fastlyClientIp || req.headers['x-real-ip'] || req.ip,
      originalIP: originalIP || req.headers['x-original-ip'],
      agent:
        req.headers['x-likecoin-user-agent'] ||
        req.headers['x-ucbrowser-ua'] ||
        req.headers['user-agent'],
      requestUrl: req.originalUrl,
    });
  }

  const data = JSON.stringify(obj);
  const dataBuffer = Buffer.from(data);
  try {
    await publisherWrapper[publishTopic].publish(dataBuffer);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('ERROR:', err);
  }
};

module.exports = {
  publisher,
  PUBSUB_TOPIC_MISC,
};
