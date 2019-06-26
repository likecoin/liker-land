const isEligible = ({ route }) => !process.server && route.name === 'civic';

export default [
  {
    name: 'video-position',
    experimentID: 'eAkMsrgEREK_E8QJRpQjlw',
    isEligible,
    variants: [{ name: 'top', weight: 5 }, { name: 'bottom', weight: 5 }],
  },
  {
    name: 'direct-signin',
    experimentID: 'a2eVFHwAT86WempNV46KwA',
    isEligible,
    variants: [{ name: 'indirect', weight: 5 }, { name: 'direct', weight: 5 }],
  },
];
