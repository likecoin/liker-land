export default {
  name: 'standnews-civic',
  experimentID: 'quz478UbT_Kf2-zdwU8rOw',
  isEligible: ({ route }) =>
    !process.server &&
    /^id/.test(route.name) &&
    route.params.id === 'standnews',
  variants: [{ name: 'origin', weight: 5 }, { name: 'variant', weight: 5 }],
};
