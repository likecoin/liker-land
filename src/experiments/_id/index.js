export default {
  name: 'id',
  experimentID: 'wFPnxOVMTdS2hi6VQtHuoA',
  isEligible: ({ route }) =>
    !process.server && route.name === 'campaign-writing-nft',
  variants: [{ name: 'origin', weight: 5 }, { name: 'variant', weight: 5 }],
};
