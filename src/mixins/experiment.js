export default function experimentsMixin(
  propName,
  experimentName,
  variantName,
  isEligible = () => true
) {
  return {
    computed: {
      [propName]() {
        if (!this.$exp || !isEligible(this)) return false;
        const { name, $activeVariants } = this.$exp;
        if (
          this.$exp.isEligible &&
          !this.$exp.isEligible({
            route: {
              ...this.$route,
              name: this.getRouteBaseName(this.$route),
            },
          })
        ) {
          return false;
        }
        return (
          name === experimentName &&
          !!$activeVariants.find(variant => variant.name === variantName)
        );
      },
    },
  };
}
