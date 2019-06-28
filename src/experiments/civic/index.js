export default {
  name: 'video-position',
  experimentID: 'v4uhA0ZNQVGx9HHsTMXOtg',
  isEligible: ({ route }) => !process.server && route.name === 'civic',
  variants: [{ name: 'top', weight: 5 }, { name: 'bottom', weight: 5 }],
};
