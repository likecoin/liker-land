const { Router } = require('express');
const { userCollection } = require('../../util/firebase');
const { stripe, STRIPE_WEBHOOK_SECRET } = require('../../util/stripe');

const router = Router();

// handle checkout hook
router.post('/hook/stripe', async (req, res, next) => {
  try {
    const sig = req.headers['stripe-signature'];
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        req.rawBody,
        sig,
        STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error(err); // eslint-disable-line no-console
      res.sendStatus(400);
      return;
    }
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const { subscription: subscriptionId } = session;
        const subscription = await stripe.subscriptions.retrieve(
          subscriptionId
        );
        const { userId } = subscription.metadata;
        const userRef = userCollection.doc(userId);
        await userRef.update({
          'stripe.subscriptionId': subscriptionId,
          'stripe.customerId': subscription.customer,
          'stripe.planId': subscription.plan.id,
        });
        break;
      }
      default:
        break;
    }
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
