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
        const {
          subscription: subscriptionId,
          setup_intent: setupIntentId,
        } = session;
        if (subscriptionId) {
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
        } else if (setupIntentId) {
          const setupIntent = await stripe.setupIntents.retrieve(setupIntentId);
          await stripe.paymentMethods.attach(setupIntent.payment_method, {
            customer: setupIntent.metadata.customer_id,
          });
          await stripe.customers.update(setupIntent.metadata.customer_id, {
            invoice_settings: {
              default_payment_method: setupIntent.payment_method,
            },
          });
          await stripe.subscriptions.update(
            setupIntent.metadata.subscription_id,
            {
              default_payment_method: setupIntent.payment_method,
            }
          );
        } else {
          // eslint-disable-next-line no-console
          console.error(`Unknown session object evt id: ${event.id}`);
          res.sendStatus(415);
          return;
        }
        break;
      }
      default: {
        res.sendStatus(415);
        return;
      }
    }
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
