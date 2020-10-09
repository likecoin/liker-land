const { Router } = require('express');
const { userCollection } = require('../../util/firebase');
const { stripe, STRIPE_PLAN_ID } = require('../../util/stripe');
const { setPrivateCacheHeader } = require('../../middleware/cache');

const { EXTERNAL_URL } = require('../../util/api');

const router = Router();

router.get('/civic/payment/stripe', async (req, res, next) => {
  try {
    setPrivateCacheHeader(res);
    if (!req.session.user) {
      res.sendStatus(401);
      return;
    }
    const userRef = userCollection.doc(req.session.user);
    const userDoc = await userRef.get();
    const { stripe: { subscriptionId, customerId } = {} } = userDoc.data();
    if (subscriptionId) {
      const [
        subscription,
        { data: [paymentMethod] = [] } = {},
      ] = await Promise.all([
        stripe.subscriptions.retrieve(subscriptionId),
        stripe.paymentMethods.list({
          customer: customerId,
          type: 'card',
          limit: 1,
        }),
      ]);
      if (
        subscription.status === 'active' ||
        subscription.status === 'past_due'
      ) {
        const { brand, last4 } = paymentMethod.card;
        res.json({
          type: 'subscription',
          status: subscription.status,
          willCancel: subscription.cancel_at_period_end,
          currentPeriodEnd: subscription.current_period_end,
          currentPeriodStart: subscription.current_period_start,
          start: subscription.start,
          card: { brand, last4 },
        });
        return;
      }
    }
    res.sendStatus(404);
  } catch (err) {
    next(err);
  }
});

// checkout based purchase endpoint
router.get('/civic/payment/stripe/payment', async (req, res, next) => {
  try {
    setPrivateCacheHeader(res);
    if (!req.session.user) {
      res.sendStatus(401);
      return;
    }
    const {
      edit,
      referrer,
      from,
      utm_campaign: utmCampaign,
      utm_content: utmContent,
      utm_medium: utmMedium,
      utm_source: utmSource,
    } = req.query;
    // start a new checkout session
    const metadata = { userId: req.session.user };
    if (from) metadata.from = from.substring(0, 32);
    if (referrer) metadata.referrer = referrer.substring(0, 500);
    if (utmCampaign) metadata.utmCampaign = utmCampaign.substring(0, 500);
    if (utmContent) metadata.utmContent = utmContent.substring(0, 500);
    if (utmMedium) metadata.utmMedium = utmMedium.substring(0, 500);
    if (utmSource) metadata.utmSource = utmSource.substring(0, 500);
    const userRef = userCollection.doc(req.session.user);
    const userDoc = await userRef.get();
    const {
      user: { email } = {},
      stripe: { subscriptionId, customerId } = {},
    } = userDoc.data();
    const stripePayload = {
      payment_method_types: ['card'], // only supports card for now
    };
    if (edit === '1') {
      stripePayload.mode = 'setup';
      stripePayload.setup_intent_data = {
        metadata: {
          customer_id: customerId,
          subscription_id: subscriptionId,
        },
      };
      if (email) stripePayload.customer_email = email;
      stripePayload.success_url = `${EXTERNAL_URL}/civic/payment/stripe/success`;
      stripePayload.cancel_url = `${EXTERNAL_URL}/settings/civic`;
    } else {
      stripePayload.subscription_data = {
        items: [{ plan: STRIPE_PLAN_ID }],
        metadata,
      };
      stripePayload.success_url = `${EXTERNAL_URL}/civic/payment/stripe/success`;
      stripePayload.cancel_url = `${EXTERNAL_URL}/civic/payment/stripe/fail`;
      if (customerId) {
        stripePayload.customer = customerId;
      } else if (email) {
        stripePayload.customer_email = email;
      }
    }
    const session = await stripe.checkout.sessions.create(stripePayload);
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
      res.sendStatus(401);
      return;
    }
    const {
      from,
      referrer,
      token,
      utmCampaign,
      utmContent,
      utmMedium,
      utmSource,
    } = req.body;
    const userRef = userCollection.doc(req.session.user);
    const userDoc = await userRef.get();
    const {
      stripe: { customerId } = {},
      user: { email, displayName } = {},
    } = userDoc.data();
    let customer;
    if (customerId) {
      customer = await stripe.customers.retrieve(customerId);
    }
    const customerInfo = {
      email,
      metadata: { userId: req.session.user, displayName },
      source: token,
      // preferred_locales: locale ? [locale] : null,
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
      if (utmCampaign) metadata.utmCampaign = utmCampaign;
      if (utmContent) metadata.utmContent = utmContent;
      if (utmMedium) metadata.utmMedium = utmMedium;
      if (utmSource) metadata.utmSource = utmSource;
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
      res.sendStatus(401);
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
      if (
        currentSubscriptions &&
        currentSubscriptions.data &&
        currentSubscriptions.data.length
      ) {
        const results = await Promise.all(
          currentSubscriptions.data.map(subscription =>
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
