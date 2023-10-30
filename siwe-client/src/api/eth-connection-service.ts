import { ethers } from 'ethers';
import { createWeb3Modal, defaultConfig } from '@web3modal/ethers5/vue'
import { showErrorMessage } from 'src/api/notify-service';
import { Web3Modal } from '@web3modal/ethers5/dist/types/src/client';

export class EthConnectionService {
    private signer: ethers.Signer | undefined;
    private isConnected: boolean;
    private walletConnectModal: Web3Modal;

    constructor() {
        this.signer = undefined;
        this.isConnected = false;
        const metadata = {
            name: 'SIWE App',
            description: 'SIWE Application',
            url: 'https://webrand3.com',
            icons: []
        };
        this.walletConnectModal = createWeb3Modal({
            ethersConfig: defaultConfig({metadata}),
            chains: [1],
            projectId: <string>process.env.WALLET_CONNECT_PROJECT_ID,
        });
    }

    async connectWithMetamask(): Promise<void> {
        if ((<any>window).ethereum === undefined) {
            showErrorMessage('Please install Metamask/Rabby');
            throw new Error('Metamask not installed');
        }
        const provider = new ethers.providers.Web3Provider((<any>window).ethereum, "any");
        await (<any>window).ethereum.enable();
        this.signer = provider.getSigner();
        this.isConnected = true;
    }

    getSigner(): ethers.Signer {
        if (!this.isConnected) {
            throw new Error('Not connected');
        }
        return this.signer!;
    }

    async closeModal() {
        await this.walletConnectModal.close();
    }

    async getWalletConnectSigner(): Promise<ethers.Signer> {
        await this.walletConnectModal.open();
        return this.walletConnectModal.getSigner()!;
    }
}

export const ETH_CONNECTION_SERVICE = new EthConnectionService();
