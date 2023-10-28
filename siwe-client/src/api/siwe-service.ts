import { SiweMessage } from 'siwe';

export const createSiweMessage = (signerAddress: string, statement: string, nonce: string): string =>{
    const message = new SiweMessage({
        domain: <string>process.env.SIWE_DOMAIN,
        address: signerAddress,
        statement,
        uri: <string>process.env.SIWE_URI,
        chainId: 1,
        version: '1',
        nonce,
    });
    return message.prepareMessage();
}
