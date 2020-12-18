<template lang="pug">
  PageHeader.overflow-x-hidden
    template
      SiteNavBar.text-like-green(class="laptop:pb-32")

    main.page-content.max-w-desktop.w-full.mx-auto
      CreatorsPage
</template>

<script>
import CreatorsPage from '~/components/CreatorsPage/CreatorsPage';
import PageHeader from '~/components/PageHeader';
import SiteNavBar from '~/components/SiteNavBar';

export default {
  components: {
    CreatorsPage,
    PageHeader,
    SiteNavBar,
  },
};
</script>
