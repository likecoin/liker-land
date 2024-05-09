<template>
  <Page
    :class="['overflow-x-hidden', 'max-w-[1924px]', 'p-[16px]', 'min-h-screen']"
  >
    <header></header>
    <div
      class="flex flex-col gap-[32px] w-full laptop:flex-row laptop:gap-[20px]"
    >
      <section id="features" class="w-[260px] desktopLg:w-[320px]">
        <ListingPageFilterSection class="w-full" />
      </section>
      <section id="mainContent" class="flex-1 w-full">
        <div class="w-full bg-dark-gray h-[100px]"></div>
      </section>
    </div>
  </Page>
</template>

<script>
export default {
  name: 'ListingPage',
  layout: 'default',
};
</script>
