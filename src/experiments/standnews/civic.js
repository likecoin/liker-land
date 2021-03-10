export default {
  name: 'standnews-civic',
  experimentID: '5508wiCuRuGw_u4sThKPDA',
  isEligible: ({ route }) =>
    !process.server &&
    /^id-civic/.test(route.name) &&
    route.params.id === 'standnews',
  variants: [{ name: 'origin', weight: 5 }, { name: 'variant', weight: 5 }],
};
