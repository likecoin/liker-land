export default {
  name: 'civic-page',
  sections: 2,
  experimentID: 'ZLsMbsP4SPKNoq6yEszq-A',
  isEligible: ({ route }) => !process.server && route.name === 'civic',
  variants: [
    { name: 'original', weight: 1 },
    { name: 'bottom-video', weight: 1 },
    { name: 'direct-signin', weight: 1 },
  ],
};
