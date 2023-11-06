<script>
import { checkUserNameValid } from '~/util/user';
import { getUserMinAPI } from '~/util/api';

export default {
  async fetch({ redirect, params, $api, localeLocation }) {
    const { id } = params;
    if (id && checkUserNameValid(id)) {
      try {
        const userInfo = await $api.$get(getUserMinAPI(id));
        redirect(
          301,
          localeLocation({
            name: 'id',
            params: { id: userInfo.likeWallet },
          })
        );
        return;
      } catch (err) {
        const msg = (err.response && err.response.data) || err;
        // eslint-disable-next-line no-console
        console.error(msg);
      }
    }
    redirect(
      301,
      localeLocation({
        name: 'id',
        params: { id },
      })
    );
  },
};
</script>
