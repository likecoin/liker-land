export default {
  name: 'keplr-install-cta',
  experimentID: 'SDo4Os66RJS9eeSm9USNWA',
  isEligible: ({ route }) => !process.server && !!route.name && !window.keplr,
  variants: [
    { name: 'origin', weight: 1 },
    { name: 'simple-banner', weight: 1 },
    { name: 'fancy-banner', weight: 1 },
  ],
};
