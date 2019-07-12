export default {
  name: 'direct-signin',
  experimentID: '3bQXKlMMTlGIYJxdSysbwQ',
  isEligible: ({ route }) => !process.server && route.name === 'civic',
  variants: [{ name: 'indirect', weight: 5 }, { name: 'direct', weight: 5 }],
};
