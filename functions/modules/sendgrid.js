const { MailService } = require('@sendgrid/mail');

let sendgrid;

function getSendGrid() {
  if (sendgrid) return sendgrid;
  const service = new MailService();
  service.setApiKey(process.env.SENDGRID_API_KEY);
  sendgrid = service;
  return sendgrid;
}

exports.sendEmail = ({ email, subject, html }) => {
  return getSendGrid().send({
    from: 'Liker Land <noreply@liker.land>',
    to: email,
    subject,
    html,
  });
};
