export default {
  name: 'id-civic',
  experimentID: 'AKTLRMRxRtG5dLHCf2t_Ug',
  isEligible: ({ route }) =>
    !process.server &&
    /^id-civic/.test(route.name) &&
    route.params.id !== 'standnews',
  variants: [{ name: 'origin', weight: 5 }, { name: 'variant', weight: 5 }],
};
