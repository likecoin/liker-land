const { onMessagePublished } = require('firebase-functions/v2/pubsub');
const {
  handleMintEvent,
  handlePurchaseEvent,
  handleTransferEvent,
} = require('./handlers');
// const { defineString } = require('firebase-functions/params');

// TODO: firebase param does not support `topic` which sucks, hardcode for now
// const topic = defineString('WNFT_PUBSUB_TOPIC');
const topic = 'wnft';

module.exports = onMessagePublished(
  {
    topic,
    secrets: ['SENDGRID_API_KEY'],
  },
  async event => {
    const { message } = event.data;
    const messageBody = message.data
      ? Buffer.from(message.data, 'base64').toString()
      : null;
    if (!messageBody) return null;
    try {
      const data = JSON.parse(messageBody);
      const { type } = data;
      switch (type) {
        case 'mint': {
          await handleMintEvent(message, data);
          break;
        }
        case 'purchase': {
          await handlePurchaseEvent(message, data);
          break;
        }
        case 'transfer': {
          await handleTransferEvent(message, data);
          break;
        }
        default:
      }
    } catch (err) {
      console.error(err);
    }
    return null;
  }
);
