<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="bg-black">

        <q-toolbar-title>
          SIWE App
        </q-toolbar-title>
        <LogoutButton></LogoutButton>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view/>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import LogoutButton from 'components/LogoutButton.vue';
import { setInitialLogged } from 'src/api/session-service';
setInitialLogged();
</script>
