export const STARTING_PRICE = 8;
const MIN_USD_PRICE = 0.5;
const LIKE_TO_USD_CONVERT_RATIO = 1024;
const PRICE_GROWTH_POWER = 2;
const PRICE_GROWTH_POWER_DEGRADE_BATCH_BEGIN = 13;
const PRICE_GROWTH_POWER_DEGRADE_BATCH_END = 18;

export function getBatch(n) {
  return Math.round(-1 + Math.sqrt(1 + STARTING_PRICE * n) / 2);
}

export function getBatchStart(batch) {
  if (batch === 0) return 0;
  return getBatchStart(batch - 1) + batch;
}

export function getAvailable(n, batch) {
  return batch + 1 - (n - getBatchStart(batch));
}

export function getPowerFactor(batch) {
  if (batch < PRICE_GROWTH_POWER_DEGRADE_BATCH_BEGIN) return 1;
  if (batch > PRICE_GROWTH_POWER_DEGRADE_BATCH_END) return 0;
  return (
    1 -
    (batch - PRICE_GROWTH_POWER_DEGRADE_BATCH_BEGIN) /
      (PRICE_GROWTH_POWER_DEGRADE_BATCH_END -
        PRICE_GROWTH_POWER_DEGRADE_BATCH_BEGIN)
  );
}

export function getPower(n) {
  return (PRICE_GROWTH_POWER - 1) * getPowerFactor(getBatch(n));
}

function getPrice(n) {
  if (n === 0) return STARTING_PRICE;
  const prevPrice = getPrice(n - 1);
  return prevPrice + (getBatch(n) - getBatch(n - 1)) * prevPrice * getPower(n);
}

export function getUSDPrice(n) {
  return Math.max(getPrice(n) / LIKE_TO_USD_CONVERT_RATIO, MIN_USD_PRICE);
}

export function getSoldCountByPrice(price) {
  let n = 0;
  let batch = 0;
  while (true) {
    n = getBatchStart(batch);
    if (getPrice(n) < price) {
      batch += 1;
    } else {
      break;
    }
  }
  return n;
}
