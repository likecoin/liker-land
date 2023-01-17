export default {
  name: 'index-to-campaign-cta',
  experimentID: 'DgS_xaxqQd6EOHWDehQ0Cg',
  isEligible: ({ route }) => !process.server && route.name === 'index',
  variants: [{ name: 'origin', weight: 1 }, { name: 'variant', weight: 1 }],
};
