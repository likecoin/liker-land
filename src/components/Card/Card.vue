<template>
  <NuxtLink
    v-if="to"
    :to="to"
  >
    <PureCard v-bind="pureCardProps">
      <template v-for="(_, slot) in $slots">
        <template :slot="slot">
          <slot :name="slot" />
        </template>
      </template>
    </PureCard>
  </NuxtLink>
  <a
    v-else
    :href="href"
    target="_blank"
    rel="noopener"
  >
    <PureCard v-bind="pureCardProps">
      <template v-for="(_, slot) in $slots">
        <template :slot="slot">
          <slot :name="slot" />
        </template>
      </template>
    </PureCard>
  </a>
</template>

<script>
import PureCard from './PureCard';

export default {
  name: 'Card',
  components: {
    PureCard,
  },
  props: {
    href: {
      type: String,
      default: '#',
    },
    to: {
      type: Object,
      default: null,
    },
    imageSrc: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
  },
  computed: {
    pureCardProps() {
      return {
        imageSrc: this.imageSrc,
        title: this.title,
        description: this.description,
      };
    },
  },
};
</script>
