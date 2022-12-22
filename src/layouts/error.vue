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
      :title="$t('error_page_not_found_title_widget')"
      :description="$t('error_page_not_found_description_widget')"
      :price="404"
      :img-src="errorImg"
      :collect-button-label="$t('error_page_not_found_return_back')"
      @collect="() => $router.go(-1)"
    />
    <div class="flex flex-col">
      <Label
        preset="h2"
        class="text-like-green"
        :text="$t('error_page_not_found_title')"
      />
      <Label
        class="text-medium-gray text-[18px] my-[18px]"
        :text="$t('error_page_not_found_description')"
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
import pageNotFound from '~/assets/images/error/pageNotFound.png';
import crispMixin from '~/mixins/crisp';

export default {
  layout: 'empty',
  mixins: [crispMixin],
  data() {
    return {
      errorImg: pageNotFound,
    };
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
