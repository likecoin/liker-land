export default {
  name: 'keplr-install-cta',
  experimentID: 'dsS6iQq1SEqqaZ_IXpL62w',
  isEligible: ({ route }) => !process.server && !!route.name,
  variants: [
    { name: 'origin', weight: 1 },
    { name: 'simple-banner', weight: 1 },
    { name: 'fancy-banner', weight: 1 },
  ],
};
