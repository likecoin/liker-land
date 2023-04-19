export default {
  name: 'class-collect-cta',
  experimentID: 'cljcOGr3RX-jUiSHCaMu-A',
  isEligible: ({ route }) => {
    const parts = route.name.split('___');
    const routeName = parts[0];
    return !process.server && routeName === 'nft-class-classId';
  },
  variants: [{ name: 'origin', weight: 1 }, { name: 'variant', weight: 1 }],
};
