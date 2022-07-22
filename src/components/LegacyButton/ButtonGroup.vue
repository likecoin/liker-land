<script>
export default {
  name: 'ButtonGroup',
  render(createElement) {
    const children = [];
    this.$slots.default.forEach(node => {
      if (node.tag) {
        // Inject separator between each child
        if (children.length > 0) {
          children.push(
            createElement('span', {
              class: 'button-group__separator',
            })
          );
        }

        children.push(node);
      }
    });
    return createElement(
      'div',
      {
        class: 'button-group',
      },
      children
    );
  },
};
</script>

<style lang="scss">
.button-group {
  display: flex;
  align-items: center;

  padding: 0;

  border: none;
  border-radius: 8px;

  background-color: #50e3c233;

  &__separator {
    flex-shrink: 0;

    width: 2px;
    height: 24px;
    border-radius: 1px;

    background-color: #28646e;
  }
}
</style>
