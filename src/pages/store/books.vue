<template>
  <Page
    :class="[
      'w-full',
      'max-w-[960px]',
      'mx-auto',
      'laptop:px-[2rem]',
      'space-y-[3rem]',
      'px-[0.75rem]',
      'pb-[8rem]',
    ]"
  >
    <h2
      class="text-[#3AB7A2] text-[2rem] desktop:text-[3rem] font-proxima font-[600] desktop:w-full"
    >
      {{ $t('store_books_page_header') }}
    </h2>

    <Nuxt />

    <footer class="flex flex-wrap justify-center items-center gap-[0.5rem]">
      <ButtonV2
        preset="secondary"
        :text="$t('backToHome')"
        :to="localeLocation({ name: 'store' })"
      />
    </footer>
  </Page>
</template>
