// eslint-disable-next-line import/no-extraneous-dependencies
const querystring = require('querystring');
const { Router } = require('express');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { getBasicV2Template } = require('@likecoin/edm');
const {
  db,
  FieldValue,
  walletUserCollection,
  nftMintSubscriptionCollection,
} = require('../../../../modules/firebase');
const { authenticateV2Login } = require('../../../middleware/auth');
const { handleRestfulError } = require('../../../middleware/error');
const { sendEmail } = require('../../../../modules/sendgrid');
const { publisher, PUBSUB_TOPIC_MISC } = require('../../../../modules/pubsub');
const { isValidFollowee } = require('../../../util/cosmos');

const {
  VERIFICATION_EMAIL_RESEND_COOLDOWN_IN_MS,
} = require('../../../constant');
const {
  EXTERNAL_URL,
  AUTHCORE_PUBLIC_KEY,
} = require('../../../../config/config');

const router = Router();

router.post('/email', authenticateV2Login, async (req, res, next) => {
  try {
    const { user } = req.session;
    const {
      email,
      followee,
      class_id: classId,
      payment_id: paymentId,
      claiming_token: claimingToken,
      verify = '1',
    } = req.query;
    const { authcoreIdToken } = req.body;
    if (!email) {
      res.status(400).send('MISSING_EMAIL');
      return;
    }
    let isVerified = false;
    if (authcoreIdToken && AUTHCORE_PUBLIC_KEY) {
      const payload = jwt.verify(authcoreIdToken, AUTHCORE_PUBLIC_KEY);
      const {
        email: authcoreEmail,
        email_verified: authcoreEmailVerified,
      } = payload;
      if (email === authcoreEmail && authcoreEmailVerified) {
        isVerified = true;
      }
    }
    const token = uuidv4();
    await db.runTransaction(async t => {
      const userRef = walletUserCollection.doc(user);
      const [userDoc, userDocWithSameEmail] = await Promise.all([
        t.get(userRef),
        t.get(walletUserCollection.where('email', '==', email).limit(1)),
      ]);
      if (!userDocWithSameEmail.empty) {
        if (userDocWithSameEmail.docs[0].id === user) {
          throw new Error('EMAIL_ALREADY_UPDATED');
        }
        throw new Error('EMAIL_ALREADY_BEEN_USED_BY_OTHER_USER');
      }
      const { emailUnconfirmed, emailLastUpdatedTs } = userDoc.data();
      if (
        !isVerified &&
        emailUnconfirmed === email &&
        emailLastUpdatedTs &&
        Date.now() - emailLastUpdatedTs.toMillis() <
          VERIFICATION_EMAIL_RESEND_COOLDOWN_IN_MS
      ) {
        throw new Error('EMAIL_UPDATE_IN_COOLDOWN');
      }

      await t.update(
        userRef,
        isVerified
          ? {
              email,
              emailUnconfirmed: FieldValue.delete(),
              emailVerifyToken: FieldValue.delete(),
              notification: {
                transfer: true,
                purchasePrice: 0,
              },
            }
          : {
              emailUnconfirmed: email,
              emailVerifyToken: token,
              emailLastUpdatedTs: FieldValue.serverTimestamp(),
            }
      );
    });

    publisher.publish(PUBSUB_TOPIC_MISC, req, {
      logType: 'UserEmailUpdate',
      email,
      user,
      followee,
      classId,
      paymentId,
    });

    const qsPayload = { wallet: user };
    if (isValidFollowee(user, followee)) {
      qsPayload.followee = followee;
    }
    if (classId && paymentId && claimingToken) {
      qsPayload.class_id = classId;
      qsPayload.payment_id = paymentId;
      qsPayload.claiming_token = claimingToken;
    }
    // We would set verify to 0 if authcore email is not verified
    // to prevent spamming user with verification email
    const shouldSendVerificationEmail = !isVerified && verify !== '0';
    if (shouldSendVerificationEmail) {
      const verificationURL = `${EXTERNAL_URL}/settings/email/verify/${token}?${querystring.stringify(
        qsPayload
      )}`;
      const title = 'Verify Your Email';
      const { subject, body } = getBasicV2Template({
        subject: title,
        title,
        content: `<p>Please click the link to verify your email:</p><p>${verificationURL}</p>`,
      });
      await sendEmail({
        email,
        subject,
        html: body,
      });
    }
    res.json({ email, isVerified });
  } catch (error) {
    switch (error.message) {
      case 'EMAIL_ALREADY_BEEN_USED_BY_OTHER_USER':
        res.status(409).send('EMAIL_ALREADY_BEEN_USED_BY_OTHER_USER');
        break;
      case 'EMAIL_ALREADY_UPDATED':
        res.status(409).send('EMAIL_ALREADY_UPDATED');
        break;
      case 'EMAIL_UPDATE_IN_COOLDOWN':
        res.status(429).send('EMAIL_UPDATE_IN_COOLDOWN');
        break;
      default:
        handleRestfulError(req, res, next, error);
    }
  }
});

router.put('/email', async (req, res, next) => {
  try {
    const { wallet: user, token, followee } = req.query;
    if (!token) {
      res.status(400).send('MISSING_TOKEN');
      return;
    }

    const userRef = walletUserCollection.doc(user);
    const email = await db.runTransaction(async t => {
      const userDoc = await t.get(userRef);
      if (!userDoc.exists) {
        throw new Error('USER_NOT_FOUND');
      }
      const { emailUnconfirmed, emailVerifyToken } = userDoc.data();
      if (emailVerifyToken !== token) {
        throw new Error('INVALID_TOKEN');
      }
      const payload = {
        email: emailUnconfirmed,
        emailUnconfirmed: FieldValue.delete(),
        emailVerifyToken: FieldValue.delete(),
        notification: {
          transfer: true,
          purchasePrice: 0,
        },
      };
      if (isValidFollowee(user, followee)) {
        payload.followees = FieldValue.arrayUnion(followee);
      }
      t.update(userRef, payload);
      return emailUnconfirmed;
    });

    const legacyQuery = nftMintSubscriptionCollection
      .where('subscriberEmail', '==', email)
      .limit(499);
    let querySnapshot = await legacyQuery.get();
    while (querySnapshot.size) {
      const batch = db.batch();
      const legacyFollowees = querySnapshot.docs.map(
        doc => doc.data().subscribedWallet
      );
      batch.update(userRef, {
        followees: FieldValue.arrayUnion(...legacyFollowees),
      });
      querySnapshot.docs.forEach(doc => batch.delete(doc.ref));
      // eslint-disable-next-line no-await-in-loop
      await batch.commit();
      // eslint-disable-next-line no-await-in-loop
      querySnapshot = await legacyQuery.get();
    }

    publisher.publish(PUBSUB_TOPIC_MISC, req, {
      logType: 'UserEmailVerified',
      email,
      user,
      followee,
    });

    res.json({ email });
  } catch (error) {
    switch (error.message) {
      case 'USER_NOT_FOUND':
        res.status(404).send('USER_NOT_FOUND');
        break;
      case 'INVALID_TOKEN':
        res.status(401).send('LINK_IS_INVALID_OR_HAS_EXPIRED');
        break;
      default:
        handleRestfulError(req, res, next, error);
    }
  }
});

module.exports = router;
