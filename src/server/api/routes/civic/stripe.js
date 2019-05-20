const { Router } = require('express');
const { userCollection } = require('../../util/firebase');
const { stripe, STRIPE_PLAN_ID } = require('../../util/stripe');

const { EXTERNAL_URL } = require('../../util/api');

const router = Router();

// checkout based purchase endpoint
router.get('/civic/payment/stripe', async (req, res, next) => {
  try {
    if (!req.session.user) {
      res.sendStatus(403);
      return;
    }
    const { referrer, from } = req.query;
    const userRef = userCollection.doc(req.session.user);
    const userDoc = await userRef.get();
    const {
      stripe: { subscriptionId } = {},
      user: { email } = {},
    } = userDoc.data();
    if (subscriptionId) {
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      if (subscription.status === ' active') {
        res.json({
          type: 'subscription',
          status: subscription.status,
          willCancel: subscription.cancel_at_period_end,
        });
        return; // exit early with current sub info
      }
    }

    // start a new checkout session
    const metadata = { userId: req.session.user };
    if (from) metadata.from = from;
    if (referrer) metadata.referrer = referrer.substring(0, 500);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'], // only supports card for now
      customer_email: email,
      subscription_data: {
        items: [{ plan: STRIPE_PLAN_ID }],
        metadata,
      },
      success_url: `${EXTERNAL_URL}/civic/payment/stripe/success`,
      cancel_url: `${EXTERNAL_URL}/civic/payment/stripe/fail`,
    });
    res.json({
      type: 'session',
      sessionId: session.id,
    });
  } catch (err) {
    next(err);
  }
});

// token based purchase endpoint
router.post('/civic/payment/stripe', async (req, res, next) => {
  try {
    if (!req.session.user) {
      res.sendStatus(403);
      return;
    }
    const { from, referrer, token } = req.body;
    const userRef = userCollection.doc(req.session.user);
    const userDoc = await userRef.get();
    const {
      stripe: { customerId } = {},
      user: { locale, email, displayName } = {},
    } = userDoc.data();
    let customer;
    if (customerId) {
      customer = await stripe.customers.retrieve(customerId);
    }
    const customerInfo = {
      email,
      metadata: { userId: req.session.user, displayName },
      source: token,
      preferred_locales: locale ? [locale] : null,
    };
    if (!customer) {
      customer = await stripe.customers.create(customerInfo);
    } else {
      customer = await stripe.customers.update(customerId, customerInfo);
    }
    let subscription;
    if (customerId) {
      const [currentSubscription] = await stripe.subscriptions.list({
        customer: customer.id,
        plan: STRIPE_PLAN_ID, // TODO: auto plan migration?
        limit: 1,
      });
      if (currentSubscription) {
        if (currentSubscription.cancel_at_period_end) {
          subscription = await stripe.subscriptions.update(
            currentSubscription.id,
            {
              cancel_at_period_end: false,
            }
          );
        }
        subscription = currentSubscription;
      }
    }
    if (!subscription) {
      const metadata = {
        userId: req.session.user,
        displayName,
      };
      if (from) metadata.from = from;
      if (referrer) metadata.referrer = referrer.substring(0, 500);
      subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{ plan: STRIPE_PLAN_ID }],
        metadata,
      });
    }
    await userRef.update({
      stripe: {
        customerId: customer.id,
        subscriptionId: subscription.id,
        planId: STRIPE_PLAN_ID,
      },
    });

    res.json({ status: subscription.status });
  } catch (err) {
    next(err);
  }
});

router.delete('/civic/payment/stripe', async (req, res, next) => {
  try {
    if (!req.session.user) {
      res.sendStatus(403);
      return;
    }
    const userRef = userCollection.doc(req.session.user);
    const userDoc = await userRef.get();
    const {
      stripe: { customerId, subscriptionId, planId } = {},
    } = userDoc.data();
    if (customerId) {
      const currentSubscriptions = await stripe.subscriptions.list({
        customer: customerId,
        plan: planId, // TODO: auto plan migration?
      });
      if (currentSubscriptions && currentSubscriptions.length) {
        const results = await Promise.all(
          currentSubscriptions.map(subscription =>
            stripe.subscriptions.update(subscription.id, {
              cancel_at_period_end: true,
            })
          )
        );
        const subscription = results.find(sub => sub.id === subscriptionId);
        res.json({ status: subscription.status });
      } else {
        res.sendStatus(404);
      }
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
