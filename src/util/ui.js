const smallNumFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 2,
});

const largeNumFormatter = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 2,
});

export function ellipsis(value) {
  if (value) {
    const len = value.length;
    const dots = '...';
    if (!value) return '';
    if (value.length > 20) {
      return value.substring(0, 8) + dots + value.substring(len - 6, len);
    }
    return value;
  }
  return value;
}

export function ellipsisDescription(value) {
  if (value) {
    const len = value.length;
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
  if (!num) {
    return '-';
  }
  return `${formatNumber(num, options)} ${unit}`;
}

export function formatNumberWithLIKE(num, options = {}) {
  return formatNumberWithUnit(num, 'LIKE', options);
}

export function getLikeCoResizedImageUrl(url, size) {
  return url.replace(/\?size=\d+/, `?size=${size}`);
}

export default ellipsis;
