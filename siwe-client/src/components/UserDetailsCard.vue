<template>
  <q-card bordered class="q-pa-md">
    <q-card-section class="bg-black text-white">
      <div class="text-h4 text-center">Your profile</div>
      <div class="text-center q-pt-md" v-if="editMode"
           :class="$q.platform.is.mobile ? 'text-subtitle2' : 'text-h6'">Please edit your profile details and save</div>
    </q-card-section>
    <q-input
        v-model="username"
        label="Username"
        :counter="editMode"
        :readonly="!editMode"
        square
        class="q-pt-lg"
        :error="usernameIsEmpty || usernameAlreadyExistsError"
        :filled="!editMode">
      <template v-slot:error>
        <div v-if="usernameIsEmpty">
          Username can't be empty
        </div>
        <div v-if="usernameAlreadyExistsError">
          Username '{{usernameWhichAlreadyExists}}' is already taken. Please chooser another one.
        </div>
      </template>
    </q-input>
    <q-input
        v-model="bio"
        label="Bio"
        class="q-pt-lg"
        square
        type="textarea"
        :counter="editMode"
        :readonly="!editMode"
        :error="bioIsEmpty"
        :filled="!editMode">
      <template v-slot:error>
        Bio can't be empty
      </template>
    </q-input>
    <div class="row justify-center">
      <div class="col-auto">
        <q-btn label="Cancel" class=" q-ma-xs" color="red-8" text-color="white" square
               @click="quitEditMode"
               v-if="editMode"/>
        <q-btn label="Save" class="q-ma-xs" color="green-8" text-color="white" square @click="createUserDetails"
               :disable="usernameIsEmpty || bioIsEmpty || formWasNotEdited"
               v-if="!userDetails || editMode"/>
        <q-btn label="EDIT profile" class="q-ma-xs" color="black" text-color="white" square
               :disable="usernameIsEmpty || bioIsEmpty"
               @click="enterEditMode"
               v-if="!editMode"/>
      </div>
    </div>
  </q-card>
</template>
<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { UserDetailsDto } from '../api/dto/user-details-dto';
import { showErrorMessage, showSuccessMessage } from 'src/api/notify-service';
import { putAuthorized } from 'src/api/api-service';

const username = ref('');
const usernameBeforeEdit = ref('');
const usernameDirty = ref(false);

const bio = ref('');
const bioDirty = ref(false);
const bioBeforeEdit = ref('');
const editMode = ref(false);
const usernameAlreadyExistsError = ref(false);
const usernameWhichAlreadyExists = ref('');

const props = defineProps({
  userDetails: {
    type: UserDetailsDto,
    required: true,
    default: undefined,
  },
});

const setFormValues = () => {
  username.value = props.userDetails?.username ?? '';
  bio.value = props.userDetails?.bio ?? '';
};

onMounted(() => {
  setFormValues();
  if (props.userDetails?.username === '' && props.userDetails?.bio === '') {
    editMode.value = true;
  }
});

watch(() => props.userDetails, () => {
  setFormValues();
});

watch(() => username.value, (value, oldValue) => {
  if (oldValue !== '') {
    usernameDirty.value = true;
  }
  usernameAlreadyExistsError.value = false;
});

watch(() => bio.value, (value, oldValue) => {
  if (oldValue !== '') {
    bioDirty.value = true;
  }
});

const usernameIsEmpty = computed(() => {
  return username.value.trim() === '';
});

const bioIsEmpty = computed(() => {
  return bio.value.trim() === '';
});

const formWasNotEdited = computed(() => {
  return !(usernameDirty.value || bioDirty.value || usernameAlreadyExistsError.value);
});

const createUserDetails = async () => {
  try {
    await putAuthorized('/api/rest/v1/user/details', new UserDetailsDto(username.value.trim(), bio.value.trim()));
    showSuccessMessage('User profile saved!');
    editMode.value = false;
  } catch (err: any) {
    if (err.response?.status === 400 && err.response?.data.errorCode === '1') {
      usernameWhichAlreadyExists.value = username.value.trim();
      usernameAlreadyExistsError.value = true;
      showErrorMessage(`Username "${username.value}" is already taken!`)
    }
  }
}

const enterEditMode = () => {
  usernameBeforeEdit.value = username.value;
  bioBeforeEdit.value = bio.value;
  editMode.value = true;
}

const quitEditMode = () => {
  username.value = usernameBeforeEdit.value;
  bio.value = bioBeforeEdit.value;
  editMode.value = false;
}
</script>
