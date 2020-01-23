export default {
  name: 'civic-register-page',
  experimentID: 'QBxvQ7G9RpSRypN7noIvOw',
  isEligible: ({ route }) =>
    !process.server && /^civic-register.*/.test(route.name),
  variants: [{ name: 'origin', weight: 5 }, { name: 'variant', weight: 5 }],
};
