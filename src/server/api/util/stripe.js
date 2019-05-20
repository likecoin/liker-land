const Stripe = require('stripe');
const {
  STRIPE_PRIVATE_KEY,
  STRIPE_PLAN_ID,
  STRIPE_WEBHOOK_SECRET,
} = require('../../config/config');

const stripe = Stripe(STRIPE_PRIVATE_KEY);

module.exports = {
  stripe,
  STRIPE_PLAN_ID,
  STRIPE_WEBHOOK_SECRET,
};
