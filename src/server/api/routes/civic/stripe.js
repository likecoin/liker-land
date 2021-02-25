const { Router } = require('express');
const { userCollection, FieldValue } = require('../../util/firebase');
const {
  stripe,
  STRIPE_PLAN_ID,
  STRIPE_CIVIC_V2_PRICE_ID,
} = require('../../util/stripe');
const { setPrivateCacheHeader } = require('../../middleware/cache');

const { apiCivicLikerGetMetadata, EXTERNAL_URL } = require('../../util/api');

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
      try {
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
            quantity: subscription.quantity,
            card: { brand, last4 },
          });
          return;
        }
      } catch (error) {
        if (error.type && error.type.startsWith('Stripe')) {
          if (error.type === 'StripeInvalidRequestError') {
            // On the fly delete invalid stripe data
            await userRef.update({ stripe: FieldValue.delete() });
          }
          res.sendStatus(404);
          return;
        }
        throw error;
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
      quantity: quantityString,
      civic_liker_version: civicVersionQuery,
    } = req.query;

    const civicLikerVersion = civicVersionQuery === '2' ? 2 : 1;
    let quantity = 1;
    if (civicLikerVersion > 1) {
      const parsedQuantity = parseInt(quantityString, 10);
      if (parsedQuantity && parsedQuantity > 0) {
        quantity = parsedQuantity;
      }
    }

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
      metadata,
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
      stripePayload.mode = 'subscription';
      stripePayload.line_items = [
        {
          price:
            civicLikerVersion === 2 ? STRIPE_CIVIC_V2_PRICE_ID : STRIPE_PLAN_ID,
          quantity,
        },
      ];
      stripePayload.subscription_data = { metadata };
      stripePayload.success_url = `${EXTERNAL_URL}/civic/payment/stripe/success`;
      if (from) {
        stripePayload.cancel_url = `${EXTERNAL_URL}/${from}`;
      } else {
        stripePayload.cancel_url = `${EXTERNAL_URL}/civic/payment/stripe/fail`;
      }
      if (customerId) {
        stripePayload.customer = customerId;
      } else if (email) {
        stripePayload.customer_email = email;
      }

      if (civicLikerVersion > 1) {
        stripePayload.success_url = `${
          stripePayload.success_url
        }?from=${encodeURIComponent(
          from
        )}&quantity=${quantity}&civic_liker_version=${civicLikerVersion}`;
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

router.get('/civic/payment/stripe/billing', async (req, res, next) => {
  try {
    setPrivateCacheHeader(res);
    if (!req.session.user) {
      res.sendStatus(401);
      return;
    }
    const userRef = userCollection.doc(req.session.user);
    const userDoc = await userRef.get();
    const { stripe: { customerId } = {} } = userDoc.data();
    if (customerId) {
      const { url } = await stripe.billingPortal.sessions.create({
        customer: customerId,
      });
      if (url) {
        res.redirect(url);
        return;
      }
    }
    res.sendStatus(404);
  } catch (err) {
    next(err);
  }
});

router.get('/civic/payment/stripe/connect', async (req, res, next) => {
  try {
    setPrivateCacheHeader(res);
    if (!req.session.user) {
      res.sendStatus(401);
      return;
    }
    const { data } = await apiCivicLikerGetMetadata(req);
    if (!data || !data.stripeConnectId) {
      res.sendStatus(404);
      return;
    }
    const link = await stripe.accounts.createLoginLink(data.stripeConnectId);
    res.redirect(link.url);
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
    const { resume } = req.query;
    const userRef = userCollection.doc(req.session.user);
    const userDoc = await userRef.get();
    const {
      stripe: { customerId, subscriptionId, planId } = {},
    } = userDoc.data();
    if (customerId) {
      const currentSubscriptions = await stripe.subscriptions.list({
        customer: customerId,
        price: planId, // TODO: auto plan migration?
      });
      if (
        currentSubscriptions &&
        currentSubscriptions.data &&
        currentSubscriptions.data.length
      ) {
        const results = await Promise.all(
          currentSubscriptions.data.map(subscription =>
            stripe.subscriptions.update(subscription.id, {
              cancel_at_period_end: resume !== '1',
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
