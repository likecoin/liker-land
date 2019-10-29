export default {
  name: 'civic-page',
  experimentID: '0xvJhv80Tn20OEfzD_lEaQ',
  isEligible: ({ route }) => !process.server && route.name === 'civic',
  variants: [{ name: 'origin', weight: 5 }, { name: 'flip', weight: 5 }],
};
