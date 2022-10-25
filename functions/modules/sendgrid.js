const functions = require('firebase-functions');

const sendgrid = require('@sendgrid/mail');

sendgrid.setApiKey(functions.config().sendgrid.api_key);

exports.sendEmail = ({ email, subject, html }) => {
  return sendgrid.send({
    from: 'Liker Land <noreply@liker.land>',
    to: email,
    subject,
    html,
  });
};
