export default {
  name: 'nft-book-cta-text',
  experimentID: 'jVyrPVSrRguBh7QF_AC8Gg',
  isEligible: ({ route }) =>
    !process.server && route.name === 'nft-class-classId',
  variants: [{ name: 'origin', weight: 1 }, { name: 'variant', weight: 1 }],
};
