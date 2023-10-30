import { SiweMessage, SiweResponse } from 'siwe';

export const siweLogin = async (message: string, signature: string, nonce?: string): Promise<SiweResponse | undefined> => {
    try {
        const SIWEObject = new SiweMessage(message);
        const siweResponse: SiweResponse | undefined = await SIWEObject.verify({signature, nonce, domain: process.env.SIWE_DOMAIN});
        if (siweResponse && isSiweMessageCorrect(siweResponse)) {
            return siweResponse;
        }
    } catch (err) {}
    console.log('SIWE verification failed');
    return undefined;
}

const isSiweMessageCorrect = (siweResponse: SiweResponse): boolean =>
    siweResponse.data.chainId === 1 &&
    siweResponse.data.version === '1' &&
    siweResponse.data.statement === 'Sign in with Ethereum to the app.' &&
    siweResponse.data.uri === process.env.SIWE_URI;
