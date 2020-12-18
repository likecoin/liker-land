<script>
import { DEFAULT_CL_SUPPORTER } from '~/constant';

export default {
  fetch({ redirect, query: { from: qId, ...query }, params: { from: pId } }) {
    const id = pId || qId || DEFAULT_CL_SUPPORTER;
    redirect({ name: 'id-civic', params: { id }, query });
  },
};
</script>
