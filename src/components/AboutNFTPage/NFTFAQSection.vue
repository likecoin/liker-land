<!-- eslint-disable vue/no-v-html -->
<template>
  <section>
    <h1
      class="
        text-[48px]
        font-proxima font-[300]
        text-like-green text-center
      "
    >{{ $t('about_nft_page_faq_title') }}</h1>
    <div class="mt-[32px]">
      <ul class="mx-auto max-w-[700px] w-full">
        <li
          v-for="(faq, index) in faqs"
          :key="`faq-${index}`"
          :class="{ 'mt-[8px]': index !== 0 }"
        >
          <NFTFAQItem :number="index + 1">
            <template #question>
              {{ faq.question }}
            </template>
            <template #answer>
              <div v-html="faq.answer" />
            </template>
          </NFTFAQItem>
        </li>
      </ul>

      <div class="flex justify-center mt-[32px]">
        <Button preset="outline" href="https://docs.like.co/faq">More FAQ</Button>
      </div>
    </div>
  </section>
</template>

<script>
import NFTFAQItem from './NFTFAQItem';

export default {
  components: {
    NFTFAQItem,
  },
  computed: {
    faqs() {
      return this.$t('faq_list').map(({ q: question, a: answer }) => ({
        question,
        answer,
      }));
    },
  },
};
</script>
