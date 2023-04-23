export default {
  name: 'class-collect-cta',
  experimentID: 'cljcOGr3RX-jUiSHCaMu-A',
  isEligible: ({ route }) =>
    !process.server && route.name === 'nft-class-classId',
  variants: [{ name: 'origin', weight: 1 }, { name: 'variant', weight: 1 }],
};
