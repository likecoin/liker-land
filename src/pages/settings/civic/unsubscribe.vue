<template lang="pug">
  .settings-civic-unsubscribe-page
    .text-12(ref="regretText") {{ $t('SettingsCivicCancelPage.regretToKnow') }}
    .settings-civic-unsubscribe-page--heart-art.mt-16(
      ref="heartArt"
      style="visibility:hidden;color:#E35050"
    )
      svg(
        width="256"
        height="170"
        viewBox="0 0 256 170"
        style="stroke:currentColor;fill:none;stroke-width:8;stroke-linecap:round;stroke-linejoin:round"
      )
        g(ref="leftHeart")
          path(d="M128,28.8C117.2,12.3,102.4,4.6,84.7,4.8C63.9,5.1,36.2,23.1,38.1,56.6c1.6,29.1,23.6,47.5,33.1,56.4c14.9,13.8,56.8,41.5,56.8,41.5")
          line(
            v-for="(line, i) in heartCrackLines"
            ref="crackLines"
            :key="`crack-${i}`"
            :x1="line.x1"
            :x2="line.x1"
            :y1="line.y1"
            :y2="line.y1"
            style="visibility:hidden"
          )
        g(ref="rightHeart")
          path(d="M128,154.2c0,0,41.9-27.7,56.8-41.5c9.5-8.8,31.5-27.3,33.1-56.4c1.9-33.5-25.8-51.5-46.6-51.7C153.6,4.3,138.8,12,128,28.4")
          path(
            ref="rightHeartCrackLine"
            d="M128.1,28.4l-12.6,28.6l25,6.7L121,107.7l19.5,4.9l-12.4,41.6l12.4-41.6l-19.5-4.9"
            style="visibility:hidden"
          )
        g(ref="heartFace" style="opacity:0")
          path(
            d='M111,78.5c0,0,0,18,17,18s17-18,17-18H111z'
            stroke-width="5"
          )
          g(fill="currentColor" stroke="none")
            circle(r="4" cy="65.5" cx='97')
            circle(r="4" cy="65.5" cx='159')
        g(ref="particles" style="opacity:0;stroke:none;fill:#28646e")
          circle(r="4" cx="252" cy="12")
          circle(r="4" cx="222" cy="150")
          circle(r="2" cx="196" cy="130")
          circle(r="2" cx="51" cy="128")
          circle(r="2" cx="28" cy="6")
          circle(r="4" cx="4" cy="96")

      Transition(name="fade" mode="out-in")
        LcLoadingIndicator.block.mx-auto.text-12(
          v-if="state === 'loading'"
        )
        .text-16.my-16(
          v-else-if="state !== 'waiting'"
          :key="heartArtDescriptionKey"
        )
          | {{ $t(`SettingsCivicCancelPage.${heartArtDescriptionKey}`, { date: getUserSubscriptionInfo.currentPeriodEndString }) }}

    Transition(
      :name="state !== 'unsubscribing' ? 'fade' : undefined"
      mode="out-in"
    )
      div(
        v-if="state !== 'waiting' && state !== 'loading'"
        :key="state"
      )
        button.btn.btn--outlined(
          v-if="state === 'unsubscribed' || state === 'continue'"
          @click="onClickFinishButton"
        )
          | {{ $t('finish') }}
        template(v-else)
          button.btn.btn--outlined(
            @click="onClickContinue"
          )
            | {{ $t('SettingsCivicCancelPage.continue') }}
          br
          button.btn.btn--outlined.btn--destructive(
            @click="onClickUnsubscribe"
          )
            | {{ $t('SettingsCivicCancelPage.unsubscribe') }}
          template(v-if="form")
            br
            i18n.inline-block.text-12.mt-8(
              path="SettingsCivicCancelPage.encounterProblem"
              tag="span"
            )
              button.btn.btn--mini(
                place="here"
                @click="unsubscribe"
              )
                | {{ $t('here') }}
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import { Circ, Expo } from 'gsap';
import { makePopup as createTypeFormPopup } from '@typeform/embed';

export default {
  data() {
    return {
      state: 'deciding',
      form: undefined,
    };
  },
  computed: {
    ...mapGetters(['getUserSubscriptionInfo']),

    heartCrackPaths() {
      return [
        'M128.1,28.4l-12.6,28.6',
        'M115.5,57.1l25,6.7',
        'M140.5,63.8L121,107.7',
        'M121,107.7l19.5,4.9',
        'M140.5,112.6l-12.4,41.6',
      ];
    },
    heartCrackLines() {
      return [
        { x1: 128.1, y1: 28.4, x2: 115.5, y2: 57.1 },
        { x1: 115.5, y1: 57.1, x2: 140.5, y2: 63.8 },
        { x1: 140.5, y1: 63.8, x2: 121, y2: 107.7 },
        { x1: 121, y1: 107.7, x2: 140.5, y2: 112.6 },
        { x1: 140.5, y1: 112.6, x2: 128.1, y2: 154.2 },
      ];
    },
    heartArtDescriptionKey() {
      switch (this.state) {
        case 'continue':
          return 'thankYourSupport';
        case 'unsubscribed':
          return 'unsubscribeSucessfully';
        default:
          return 'needYourSupport';
      }
    },
  },
  mounted() {
    const tl = new this.$gsap.TimelineMax();
    // Fade in heart
    tl.fromTo(
      this.$refs.heartArt,
      0.5,
      { opacity: 0 },
      { opacity: 1, visibility: 'visible' }
    );
    // Show small cracks
    this.showCracks(tl, 0, 3);
  },
  methods: {
    ...mapActions(['cancelUserSubscription']),

    showCracks(gsapTimeline, ...range) {
      const crackLines = this.$refs.crackLines.slice(...range);
      this.heartCrackLines.slice(...range).forEach(({ x2, y2 }, i) => {
        gsapTimeline.to(crackLines[i], 0.1, {
          visibility: 'visible',
          clearProps: 'visibility',
          attr: { x2, y2 },
          ease: Circ.easeOut,
          delay: i * 0.1,
        });
      });
    },
    breakHeart(tl) {
      const { leftHeart, rightHeart, rightHeartCrackLine } = this.$refs;
      // Show cracks
      this.showCracks(tl, -2);
      tl.set(rightHeartCrackLine, { visibility: 'visible' });
      // Split heart in half
      tl.addLabel('splitHeart');
      tl.to(leftHeart, 0.5, {
        rotation: -8,
        ease: 'easeInExpo',
        x: -6,
        y: 8,
        transformOrigin: 'right bottom',
      });
      tl.to(
        rightHeart,
        0.5,
        {
          rotation: 8,
          x: 6,
          ease: 'easeInExpo',
          transformOrigin: 'left bottom',
        },
        'splitHeart'
      );
    },
    restoreHeart(tl) {
      const {
        crackLines,
        leftHeart,
        rightHeart,
        rightHeartCrackLine,
      } = this.$refs;
      // Merge two half hearts into one
      tl.addLabel('restoreHeart');
      tl.to(leftHeart, 0.5, {
        rotation: 0,
        x: 0,
        y: 0,
        transformOrigin: 'right bottom',
        clearProps: 'all',
      });
      tl.to(
        rightHeart,
        0.5,
        {
          rotation: 0,
          x: 0,
          transformOrigin: 'left bottom',
          clearProps: 'all',
        },
        'restoreHeart'
      );
      // Fade out cracks
      tl.to([...crackLines, rightHeartCrackLine], 0.5, { opacity: 0 });
    },
    makeHeartHappy(tl) {
      const {
        regretText,
        heartArt,
        heartFace,
        crackLines,
        particles,
      } = this.$refs;
      tl.addLabel('startHappy');
      // Turn green
      tl.to(heartArt, 0.5, { color: '#50E3C2' });
      // Fade out cracks
      tl.to([crackLines, regretText], 0.5, { opacity: 0 }, 'startHappy');
      // Show smile
      tl.fromTo(
        heartFace,
        0.5,
        { scale: 0, transformOrigin: 'center' },
        { scale: 1, opacity: 1 },
        'startHappy'
      );
      tl.fromTo(
        particles,
        1.25,
        { scale: 0, transformOrigin: 'center' },
        { scale: 1, opacity: 1, ease: Expo.easeOut },
        'startHappy'
      );
    },
    showFeedbackForm() {
      if (!this.form) {
        this.form = createTypeFormPopup(
          'https://admin.typeform.com/to/QkY7px',
          {
            hideHeaders: true,
            hideFooter: true,
            onSubmit: this.onSubmitFeedbackForm,
          }
        );
      }
      this.form.open();
    },
    async unsubscribe() {
      this.state = 'loading';
      try {
        await this.cancelUserSubscription();
        this.state = 'unsubscribed';
      } catch (err) {
        this.$nuxt.error(err);
      }
    },
    onClickUnsubscribe() {
      switch (this.state) {
        case 'deciding': {
          const tl = new this.$gsap.TimelineMax({
            onComplete: () => {
              this.state = 'unsubscribing';
              this.showFeedbackForm();
            },
          });
          this.breakHeart(tl);
          break;
        }

        case 'unsubscribing':
          this.showFeedbackForm();
          break;

        default:
      }
    },
    onClickContinue() {
      const tl = new this.$gsap.TimelineMax({
        onComplete: () => {
          this.state = 'continue';
        },
      });
      switch (this.state) {
        case 'deciding':
          this.state = 'waiting';
          this.makeHeartHappy(tl);
          break;

        default:
        case 'unsubscribing':
          this.state = 'waiting';
          this.restoreHeart(tl);
          this.makeHeartHappy(tl);
          break;
      }
    },
    onSubmitFeedbackForm() {
      this.form.close();
      this.unsubscribe();
    },
    onClickFinishButton() {
      this.$router[this.state === 'unsubscribed' ? 'replace' : 'push']({
        name: 'index-following',
      });
    },
  },
};
</script>

<style lang="scss">
.settings-civic-unsubscribe-page {
  width: 100%;

  text-align: center;
}
</style>
