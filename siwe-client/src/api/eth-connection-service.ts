import { ethers } from 'ethers';
import { EthereumProvider } from "@walletconnect/ethereum-provider";
import { showErrorMessage } from 'src/api/notify-service';

export class EthConnectionService {

    private provider: ethers.BrowserProvider | undefined;
    private signer: ethers.Signer | undefined;
    private isConnected:  boolean;
    constructor() {
        this.provider = undefined;
        this.signer = undefined;
        this.isConnected = false;
    }

    async connectWithMetamask(): Promise<void> {
        if (window.ethereum === undefined) {
            showErrorMessage('Please install Metamask/Rabby');
            throw new Error('Metamask not installed');
        }
        this.provider = new ethers.BrowserProvider(window.ethereum);
        this.signer = await this.provider.getSigner();
        this.isConnected = true;
    }

    async connectWithWalletConnect(): Promise<void> {
        const provider = await EthereumProvider.init({
            projectId: '809ab615b0eea74b157d4119de6bd41d', // REQUIRED your projectId
            chains: [1], // REQUIRED supported chains [1, 3, 4, 5, 42, 100, 31337
            showQrModal: true, // REQUIRED set to "true" to use @walletconnect/modal
        });
        this.provider = new ethers.BrowserProvider(provider);
        await provider.connect();
        this.signer = await this.provider.getSigner();
        this.isConnected = true;
    }

    getSigner(): ethers.Signer {
        if (!this.isConnected) {
            throw new Error('Not connected');
        }
        return this.signer!;
    }
}

export const ETH_CONNECTION_SERVICE = new EthConnectionService();
