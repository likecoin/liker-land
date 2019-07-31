export default {
  name: 'civic-register-page-error',
  experimentID: '-ZAD0MyxTySnOmA902g6Jg',
  isEligible: ({ route }) => !process.server && route.name === 'civic-register',
  variants: [{ name: 'old', weight: 5 }, { name: 'new', weight: 5 }],
};
