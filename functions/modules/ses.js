const aws = require('aws-sdk');
const functions = require('firebase-functions');

aws.config.accessKeyId = functions.config().aws.config.access_key_id;
aws.config.secretAccessKey = functions.config().aws.config.secret_access_key;
aws.config.region = functions.config().aws.config.region;

const ses = new aws.SES();

exports.ses = ses;

exports.sendEmail = ({ email, subject, body, tags = [] }) =>
  ses
    .sendEmail({
      Source: '"Liker Land" <team@liker.land>',
      ConfigurationSetName: 'likeco_ses',
      Tags: [...tags],
      Destination: {
        ToAddresses: [email],
      },
      Message: {
        Subject: {
          Charset: 'UTF-8',
          Data: subject,
        },
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: body,
          },
        },
      },
    })
    .promise();
