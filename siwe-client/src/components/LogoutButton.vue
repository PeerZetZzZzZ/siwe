<template>
  <div>
    <span class="text-bold text-subtitle2">{{ account }}</span>
    <q-btn label="LOGOUT" class="q-ma-xs" square outline @click="logout" v-if="connectionStore.isLogged"></q-btn>
  </div>
</template>
<script setup lang="ts">
import { useConnectionStore } from 'stores/connection-store';
import { showSuccessMessage } from 'src/api/notify-service';
import { postAuthorized } from 'src/api/api-service';
import { setLoggedOut } from 'src/api/session-service';
import { useQuasar } from 'quasar';
import { computed } from 'vue';

const $q = useQuasar();
const connectionStore = useConnectionStore();
const logout = async () => {
  await postAuthorized('/api/rest/v1/user/logout');
  setLoggedOut();
  showSuccessMessage('Logged out!');
}

const account = computed(() => {
  if ($q.platform.is.mobile) {
    if (connectionStore.account.length > 4) {
      return connectionStore.account.substring(0, 4) + '...' + connectionStore.account.substring(connectionStore.account.length - 4);
    }
    return connectionStore.account;
  } else {
    return connectionStore.account;
  }
});
</script>
