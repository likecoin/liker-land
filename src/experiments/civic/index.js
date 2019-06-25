export default {
  name: 'video-position',
  experimentID: 'eAkMsrgEREK_E8QJRpQjlw',
  isEligible: ({ route }) => !process.server && route.name === 'civic',
  variants: [{ name: 'top', weight: 5 }, { name: 'bottom', weight: 5 }],
};
