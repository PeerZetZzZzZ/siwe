import { defineStore } from 'pinia';

export const useConnectionStore = defineStore('connectionStore', {
    state: () => ({
        account: '',
        isLogged: false,
    }),
    actions: {
        setConnected(account: string, isLogged: boolean) {
            this.account = account;
            this.isLogged = isLogged;
        },
    },
});
