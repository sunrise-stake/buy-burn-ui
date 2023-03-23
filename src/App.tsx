import React, { useMemo } from 'react';
import './App.css';
import logo from './logo.png';
import {ConnectionProvider, useConnection, useWallet, WalletProvider} from '@solana/wallet-adapter-react';
import {LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction} from "@solana/web3.js";
import {
    GlowWalletAdapter,
    PhantomWalletAdapter,
    SolflareWalletAdapter,
    SolletWalletAdapter, TorusWalletAdapter
} from "@solana/wallet-adapter-wallets";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
    WalletModalProvider,
    WalletMultiButton
} from "@solana/wallet-adapter-react-ui";
import {useYieldController} from "./hooks/useYieldController";
import {usePrice} from "./hooks/usePrice";
import {useTokenBalance} from "./hooks/useTokenBalance";
import {useSolBalance} from "./hooks/useSolBalance";

require('@solana/wallet-adapter-react-ui/styles.css');

const yieldAccountSol = new PublicKey("E7BjB9UQp814RsMPq7U6S4fy6wRzn6tFTYt31kJoskoq");
const holdingAccountNct = new PublicKey("9tGKhW8WGkmx1tkxLoMwanb3XgQ9yJFDPnNggYjb1KUR");

const round = (value: number, decimals: number) => Number(Math.round(Number(value + 'e' + decimals)) + 'e-' + decimals);

const Content = () => {
    const { connection } = useConnection();
    const wallet = useWallet()
    const { state, allocateYield } = useYieldController()
    const { solPrice, nctPrice, solNctPrice } = usePrice();
    const nctBalance = useTokenBalance(holdingAccountNct);
    const yieldAccountBalance = useSolBalance(yieldAccountSol);
    const [burnAmount, setBurnAmount] = React.useState(0);

    const burn = async () => {
        if (wallet?.publicKey && state) {
            if (burnAmount > 0) {
                const transaction = new Transaction().add(SystemProgram.transfer({
                    fromPubkey: wallet.publicKey,
                    toPubkey: yieldAccountSol,
                    lamports: burnAmount * LAMPORTS_PER_SOL
                }));
                await wallet.sendTransaction(transaction, connection);
            }
            await allocateYield();
        }
    }

    return <header className="App-header">
        <WalletMultiButton/>
        <img src={logo} className="App-logo" alt="logo" />
        <p><>SOL/USD Price (USD): {round(solPrice?.toNumber() || 0, 2)}</></p>
        <p><>NCT/USD Price (USD): {round(nctPrice?.toNumber() || 0, 2)}</></p>
        <p><>SOL/NCT Price: {round(solNctPrice?.toNumber() || 0, 2)}</></p>
        <p><>Account Balance: {round((yieldAccountBalance || 0) / (1_000_000_000), 5)}</></p>
        <p><>NCT Balance: {round(nctBalance || 0, 2)}</></p>
        <div>
            <>
                <input defaultValue={burnAmount || 0} onChange={(e) => setBurnAmount(parseFloat(e.target.value))}/>
                <p>Equivalent NCT { solNctPrice ? round((burnAmount * solNctPrice.toNumber()), 2) : "-" }</p>
                <button onClick={burn}>Burn</button>
            </>
        </div>
    </header>
}

function App() {
    const network = WalletAdapterNetwork.Mainnet;
    const endpoint = "https://solemn-cosmological-emerald.solana-mainnet.discover.quiknode.pro/94f330ee450ed4946bca1d93a688daeab133f326/";
    const wallets = useMemo(
        () => [
            new PhantomWalletAdapter(),
            new GlowWalletAdapter(),
            new SolflareWalletAdapter({ network }),
            new TorusWalletAdapter(),
            new SolletWalletAdapter({ network }),
        ],
        [network]
    );

    return (
        <div className="App">
            <ConnectionProvider endpoint={endpoint}>
                <WalletProvider wallets={wallets} autoConnect>
                    <WalletModalProvider>
                        <Content />
                    </WalletModalProvider>
                </WalletProvider>
            </ConnectionProvider>
        </div>
    );
}

export default App;
