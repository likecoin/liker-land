const smallNumFormatter = new Intl.NumberFormat('en-US');

const largeNumFormatter = new Intl.NumberFormat('en-GB', {
  notation: 'compact',
  maximumFractionDigits: 2,
});

export default function formatNumber(num) {
  return (num >= 10000 ? largeNumFormatter : smallNumFormatter).format(num);
}
