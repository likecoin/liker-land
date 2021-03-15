export default {
  name: 'id',
  experimentID: 'Us72JhlBSHCMQ0e_4oW4qA',
  isEligible: ({ route }) =>
    !process.server &&
    /^id/.test(route.name) &&
    route.params.id !== 'standnews',
  variants: [{ name: 'origin', weight: 5 }, { name: 'variant', weight: 5 }],
};
