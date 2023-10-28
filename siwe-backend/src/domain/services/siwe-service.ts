import { SiweMessage, SiweResponse } from 'siwe';

export const siweLogin = async (message: string, signature: string, nonce?: string): Promise<SiweResponse | undefined> => {
    const SIWEObject = new SiweMessage(message);
    return await SIWEObject.verify({signature, nonce});
}