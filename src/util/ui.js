import { getImageResizeAPI } from './api';

const smallNumFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 2,
});

const largeNumFormatter = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 2,
});

export function ellipsis(value, maxLength = 20, endLength = 6) {
  if (!value) return '';
  const len = value.length;
  const dots = '...';

  if (len > maxLength) {
    return value.substring(0, 8) + dots + value.substring(len - endLength, len);
  }

  return value;
}

export function ellipsisNFTName(value) {
  if (value) {
    const len = value.length;
    const dots = '...';
    if (len > 50) {
      return value.substring(0, 40) + dots + value.substring(len - 2, len);
    }
    return value;
  }
  return value;
}

export function ellipsisDescription(value) {
  if (value) {
    const dots = '...';
    if (!value) return '';
    if (value.length > 200) {
      return value.substring(0, 200) + dots;
    }
    return value;
  }
  return value;
}

export function copyToClipboard(text) {
  const copyText = document.createElement('p');
  copyText.textContent = text;
  document.body.appendChild(copyText);
  const selection = document.getSelection();
  const range = document.createRange();
  range.selectNode(copyText);
  selection.removeAllRanges();
  selection.addRange(range);
  document.execCommand('copy');
  selection.removeAllRanges();
  document.body.removeChild(copyText);
}

export function formatNumber(num, options = {}) {
  return (!options.isFull && num >= 100000
    ? largeNumFormatter
    : smallNumFormatter
  ).format(num);
}

export function formatNumberWithUnit(num, unit, options = {}) {
  if (num === 0) return 'FREE';
  if (!num) return '-';
  return `${formatNumber(num, options)} ${unit}`;
}

export function formatNumberWithLIKE(num, options = {}) {
  return formatNumberWithUnit(num, 'LIKE', options);
}

export function formatNumberWithUSD(num, options = {}) {
  return formatNumberWithUnit(num, 'USD', options);
}

export function getLikeCoResizedImageUrl(url, size) {
  if (url.includes('like.co')) {
    return url.replace(/\?size=\d+/, `?size=${size}`);
  }
  if (url.includes('api.dicebear.com')) {
    return url;
  }
  return getImageResizeAPI(url, { width: size });
}

export function oscillate(min, max, period, time) {
  const mag = max - min;
  return (
    Math.cos(Math.PI + (2 * Math.PI * time) / period) * (min + mag / 2.0) +
    mag / 2.0
  );
}

export function formatDuration(milliseconds) {
  const seconds = Math.floor((milliseconds / 1000) % 60);
  const minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
  const hours = Math.floor((milliseconds / (1000 * 60 * 60)) % 24);

  return `${hours}h ${minutes}m ${seconds}s`;
}

export default ellipsis;
