import CivicQuantitySelectItem from './CivicQuantitySelectItem';

export default {
  title: 'Civic Quantity Select',
};

export const Item = () => ({
  components: {
    CivicQuantitySelectItem,
  },
  template: `
    <CivicQuantitySelectItem
      :price="5"
      price-emoji="☕️"
      :is-selected="false"
    />
  `,
});

export const ItemSelected = () => ({
  components: {
    CivicQuantitySelectItem,
  },
  template: `
    <CivicQuantitySelectItem
      :price="5"
      price-emoji="☕️"
      :is-selected="true"
    />
  `,
});

export const ItemList = () => ({
  components: {
    CivicQuantitySelectItem,
  },
  template: `
    <ul class="list-reset flex -m-8" style="min-width: 422px;min-height: 160px">
      <li class="flex-1 p-8">
        <CivicQuantitySelectItem
          class="block w-full h-full"
          :price="5"
          price-emoji="☕️"
          :is-selected="true"
        />
      </li>
      <li class="flex-1 p-8">
        <CivicQuantitySelectItem
          class="block w-full h-full"
          :price="20"
          price-emoji="🍰"
          :is-selected="false"
        />
      </li>
      <li class="flex-1 p-8">
        <CivicQuantitySelectItem
          class="block w-full h-full"
          :price="100"
          price-emoji="🍾"
          :is-selected="false"
        />
      </li>
    </ul>
  `,
});
