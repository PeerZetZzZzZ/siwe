<template>
  <q-page>
    <div class="row items-center justify-center q-pa-lg vertical-middle"  :style="`height: ${rowHeight}`">
      <div class="col-lg-6 col-xs-grow items-center justify-center" >

        <UserDetailsCard :user-details="userDetails" v-if="userDetails && connectionStore.isLogged"></UserDetailsCard>

        <div v-if="profileNotExists && connectionStore.isLogged" class="text-center">
          <span class="text-h4">Your profile <b class="text-red-8">not exists</b> yet</span><br>
          <q-btn label="Create profile" color="black" class="q-mt-xs" square @click="createProfile"></q-btn>
        </div>

        <div v-if="!connectionStore.isLogged" class="text-center">
          <span class="text-h4">Please <b>log in</b> to see your profile </span><br>
          <LoginButton class="q-mt-xs"></LoginButton>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useQuasar } from 'quasar';
import UserDetailsCard from 'components/UserDetailsCard.vue';
import { useConnectionStore } from 'stores/connection-store';
import LoginButton from 'components/LoginButton.vue';
import { getAuthorized } from 'src/api/api-service';
import { UserDetailsDto } from 'src/api/dto/user-details-dto';

const userDetails = ref(<UserDetailsDto | undefined>undefined);
const profileNotExists = ref(false);
const $q = useQuasar();
const connectionStore = useConnectionStore();
const rowHeight = ref('100%');
const fetchUserData = async () => {
  try {
    $q.loading.show({
      delay: 100, // ms
      message: 'Reading user data',
      backgroundColor: 'black',
      messageColor: 'white',
    });
    userDetails.value = await getAuthorized<UserDetailsDto>('/api/rest/v1/user/details');
    $q.loading.hide();
  } catch (err: any) {
    $q.loading.hide();
    if (err.response?.status === 404) {
      profileNotExists.value = true;
    }
  }
};

watch(() => connectionStore.isLogged, () => {
  if (connectionStore.isLogged) {
    fetchUserData();
  }
});

const calculateFullscreenRowHeight = () => {
  rowHeight.value = (window.innerHeight - 40) + 'px';
};

onMounted(async () => {
  await fetchUserData();
  calculateFullscreenRowHeight();
});

const createProfile = () => {
  userDetails.value = new UserDetailsDto('', '');
  profileNotExists.value = false;
};

window.addEventListener('resize', calculateFullscreenRowHeight, true);

onBeforeUnmount(() => {
  window.removeEventListener('resize', calculateFullscreenRowHeight, true);
});
</script>
