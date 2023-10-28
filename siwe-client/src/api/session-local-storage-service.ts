export const setLoggedAccount = (account: string) => {
    localStorage.setItem('account', account);
}

export const removeLoggedAccount = () => {
    localStorage.removeItem('account');
}

export const getLoggedAccount = (): string | undefined => {
    const account = localStorage.getItem('account');
    return account ?? undefined;
}
