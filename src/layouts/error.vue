<template>
  <div
    class="
      flex
      flex-col
      laptop:flex-row
      items-center
      justify-center
      w-full
      h-screen
      px-[24px]
      gap-[28px]
      bg-shade-gray
    "
  >
    <NFTWidget
      class="shadow-lg w-full max-w-[400px]"
      :title="error.message || $t('error_page_not_found_title_widget')"
      :description="$t('error_page_not_found_description_widget')"
      :price="error.statusCode || 404"
      :img-src="errorInfo.image"
      :collect-button-label="$t('error_page_not_found_return_back')"
      @collect="() => $router.go(-1)"
    />
    <div class="flex flex-col">
      <Label
        preset="h2"
        class="text-like-green"
        :text="errorInfo.title"
      />
      <Label
        class="text-medium-gray text-[18px] my-[18px]"
        :text="errorInfo.description"
      />
      <div
        class="
          flex
          justify-center
          laptop:justify-start
          items-center
          gap-[12px]
          mt-[12px]
        "
      >
        <ButtonV2
          :text="$t('error_page_not_found_return_home')"
          preset="primary"
          :to="{ name: 'index' }"
        />
        <ButtonV2
          :text="$t('error_page_not_found_report_problem')"
          preset="outline"
          @click="handleClickReport"
        />
      </div>
    </div>
  </div>
</template>

<script>
import pageNotFound from '~/assets/images/error/404.svg';
import severError from '~/assets/images/error/500.svg';
import crispMixin from '~/mixins/crisp';

export default {
  layout: 'empty',
  mixins: [crispMixin],
  props: {
    error: {
      type: Object,
      required: true,
    },
  },
  computed: {
    errorInfo() {
      const errorObj = {};
      switch (String(this.error.statusCode)[0]) {
        case '5':
          errorObj.image = severError;
          errorObj.title = this.$t('error_page_not_found_title_500');
          errorObj.description = this.$t(
            'error_page_not_found_description_500'
          );
          break;

        case '4':
        default:
          errorObj.image = pageNotFound;
          errorObj.title = this.$t('error_page_not_found_title_404');
          errorObj.description = this.$t(
            'error_page_not_found_description_404'
          );
          break;
      }
      return errorObj;
    },
  },
  methods: {
    handleClickReport() {
      if (this.$crisp) {
        this.showCrisp();
        this.$crisp.push(['do', 'chat:open']);
      } else {
        window.open(
          'https://discord.com/channels/763001015712350231/814761730349596712'
        );
      }
    },
  },
};
</script>
