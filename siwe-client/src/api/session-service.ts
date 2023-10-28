import { getLoggedAccount, removeLoggedAccount, setLoggedAccount } from 'src/api/session-local-storage-service';
import { useConnectionStore } from 'stores/connection-store';

const connectionStore = useConnectionStore();
export const setLogged = (account: string) => {
  setLoggedAccount(account);
  connectionStore.setConnected(account, true);
}

export const setLoggedOut = () => {
  removeLoggedAccount();
  connectionStore.setConnected('', false);
}

export const setInitialLogged = () => {
    if (!connectionStore.isLogged) {
        const loggedAccount: string | undefined = getLoggedAccount();
        if (loggedAccount) {
            connectionStore.setConnected(loggedAccount, true);
        }
    }
}
