<template>
  <q-btn label="LOGIN" color="black" @click="login" v-if="!connectionStore.isLogged"></q-btn>
</template>
<script setup lang="ts">
import { ETH_CONNECTION_SERVICE } from 'src/api/eth-connection-service';
import { createSiweMessage } from 'src/api/siwe-service';
import { showSuccessMessage } from 'src/api/notify-service';
import { useConnectionStore } from 'stores/connection-store';
import { get, post } from 'src/api/api-service';
import { setLogged } from 'src/api/session-service';
import { useQuasar } from 'quasar';

const connectionStore = useConnectionStore();
const $q = useQuasar();

const login = async () => {
  if ($q.platform.is.mobile) {
    await ETH_CONNECTION_SERVICE.connectWithWalletConnect();
  } else {
    await ETH_CONNECTION_SERVICE.connectWithMetamask();
  }
  const signer = ETH_CONNECTION_SERVICE.getSigner();
  const signerAddress = await signer.getAddress();
  const nonceResponse = await get<{ nonce: string }>('/api/rest/v1/user/nonce');
  const nonce = nonceResponse.nonce;
  const siweMessage = createSiweMessage(signerAddress, 'Sign in with Ethereum to the app.', nonce);
  const signedMessage = await signer.signMessage(siweMessage);
  await post('/api/rest/v1/user/login', {
    message: siweMessage,
    signature: signedMessage,
  });
  setLogged(signerAddress);
  showSuccessMessage('Logged in!');
}
</script>
