const { Router } = require('express');
const { v4: uuidv4 } = require('uuid');
const { getBasicTemplate } = require('@likecoin/edm');
const {
  db,
  FieldValue,
  walletUserCollection,
  nftMintSubscriptionCollection,
} = require('../../../../modules/firebase');
const { authenticateV2Login } = require('../../../middleware/auth');
const { handleRestfulError } = require('../../../middleware/error');
const { sendEmail } = require('../../../../modules/sendgrid');

const {
  VERIFICATION_EMAIL_RESEND_COOLDOWN_IN_MS,
} = require('../../../constant');
const { EXTERNAL_URL } = require('../../../../config/config');

const router = Router();

router.post('/email', authenticateV2Login, async (req, res, next) => {
  try {
    const { user } = req.session;
    const { email } = req.query;
    if (!email) {
      res.status(400).send('MISSING_EMAIL');
      return;
    }
    console.log(user, email);
    const token = uuidv4();
    await db.runTransaction(async t => {
      const userRef = walletUserCollection.doc(user);
      const userDoc = await t.get(userRef);
      const {
        email: currentEmail,
        emailUnconfirmed,
        emailLastUpdatedTs,
      } = userDoc.data();
      if (email === currentEmail) {
        throw new Error('EMAIL_ALREADY_UPDATED');
      }
      if (
        emailUnconfirmed === email &&
        emailLastUpdatedTs &&
        Date.now() - emailLastUpdatedTs.toMillis() <
          VERIFICATION_EMAIL_RESEND_COOLDOWN_IN_MS
      ) {
        throw new Error('EMAIL_UPDATE_IN_COOLDOWN');
      }

      await t.update(userRef, {
        emailUnconfirmed: email,
        emailVerifyToken: token,
        emailLastUpdatedTs: FieldValue.serverTimestamp(),
      });
    });
    const verificationURL = `${EXTERNAL_URL}/settings/email/verify/${token}?wallet=${user}`;
    const { subject, body } = getBasicTemplate({
      subject: 'Verify your email',
      content: `<p>Please click the link to verify your email:</p><p>${verificationURL}</p>`,
    });
    await sendEmail({
      email,
      subject,
      html: body,
    });
    res.sendStatus(200);
  } catch (error) {
    switch (error.message) {
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
    const { wallet: user, token } = req.query;
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
      const { emailUnconfirmed: email, emailVerifyToken } = userDoc.data();
      if (emailVerifyToken !== token) {
        throw new Error('INVALID_TOKEN');
      }
      t.update(userRef, {
        email,
        emailUnconfirmed: FieldValue.delete(),
        emailVerifyToken: FieldValue.delete(),
      });
      return email;
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

    res.sendStatus(200);
  } catch (error) {
    switch (error.message) {
      case 'USER_NOT_FOUND':
        res.status(404).send('USER_NOT_FOUND');
        break;
      case 'INVALID_TOKEN':
        res.status(400).send('INVALID_TOKEN');
        break;
      default:
        handleRestfulError(req, res, next, error);
    }
  }
});

module.exports = router;
