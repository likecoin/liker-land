export default {
  name: 'recommend-connection-method',
  experimentID: 'O45U7CF8TSqn97ASkFalgg',
  isEligible: ({ route }) => !process.server && !!route.name,
  variants: [{ name: 'origin', weight: 1 }, { name: 'variant', weight: 1 }],
};
