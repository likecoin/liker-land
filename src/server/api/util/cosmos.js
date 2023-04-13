// eslint-disable-next-line import/no-extraneous-dependencies
const bech32 = require('bech32');
const createHash = require('create-hash');
const secp256k1 = require('secp256k1');

const FIVE_MIN_IN_MS = 300000;

function isValidAddress(address) {
  try {
    const { prefix } = bech32.decode(address);
    return ['cosmos', 'like'].includes(prefix);
  } catch (error) {
    return false;
  }
}

function isValidFollowee(follower, followee) {
  return isValidAddress(followee) && follower !== followee;
}

function publicKeyBinaryToAddresses(publicKey) {
  const sha256 = createHash('sha256');
  const ripemd = createHash('ripemd160');
  sha256.update(publicKey);
  ripemd.update(sha256.digest());
  const rawAddr = ripemd.digest();
  const likeAddress = bech32.encode('like', bech32.toWords(rawAddr));
  return { likeAddress };
}

function verifyCosmosSignedMessage({
  signature,
  publicKey,
  message,
  inputWallet,
}) {
  const signatureBinary = Buffer.from(signature, 'base64');
  const publicKeyBinary = Buffer.from(publicKey, 'base64');
  const msgSha256 = createHash('sha256');
  msgSha256.update(message);
  const msgHash = msgSha256.digest();
  const { likeAddress } = publicKeyBinaryToAddresses(publicKeyBinary);
  const valid =
    secp256k1.ecdsaVerify(signatureBinary, msgHash, publicKeyBinary) &&
    likeAddress === inputWallet;
  return valid;
}

function parseActualLoginPayload(message, signMethod) {
  try {
    const parsedMessage = JSON.parse(message);
    let payload;
    switch (signMethod) {
      case 'ADR-036': {
        // TODO: verify ADR-036, e.g. msgs length, type, signer
        // or use { verifyADR36Amino } from @keplr-wallet/cosmos
        const base64Payload = parsedMessage.msgs[0].value.data;
        payload = Buffer.from(base64Payload, 'base64').toString('utf8');
        break;
      }
      default:
        payload = parsedMessage.memo;
    }
    return JSON.parse(payload.substr(payload.indexOf('{')));
  } catch (err) {
    throw new Error('INVALID_PAYLOAD');
  }
}

function checkCosmosSignPayload({
  signature,
  publicKey,
  message,
  inputWallet,
  signMethod = 'memo',
}) {
  const verified = verifyCosmosSignedMessage({
    signature,
    publicKey,
    message,
    inputWallet,
  });
  if (!verified) {
    throw new Error('INVALID_SIGNATURE');
  }
  const actualPayload = parseActualLoginPayload(message, signMethod);
  const { ts, address: payloadLikeWallet } = actualPayload;
  if (payloadLikeWallet !== inputWallet) {
    throw new Error('PAYLOAD_WALLET_NOT_MATCH');
  }
  if (Math.abs(ts - Date.now()) > FIVE_MIN_IN_MS) {
    throw new Error('PAYLOAD_EXPIRED');
  }
  return actualPayload;
}

module.exports = {
  isValidAddress,
  isValidFollowee,
  checkCosmosSignPayload,
};
