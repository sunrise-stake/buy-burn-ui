import {PublicKey} from "@solana/web3.js";
import Big from "big.js";
import {useEffect, useState} from "react";
import {useConnection} from "@solana/wallet-adapter-react";

export const useTokenBalance = (tokenAccountAddress: PublicKey) => {
    const {connection} = useConnection();
    const [result, setResult] = useState<number | null>(null);

    useEffect(() => {
        void (async () => {
            const balance = await connection.getTokenAccountBalance(tokenAccountAddress);
            setResult(balance.value.uiAmount);
        })();

        connection.onAccountChange(tokenAccountAddress, async () => {
            const balance = await connection.getTokenAccountBalance(tokenAccountAddress);
            setResult(balance.value.uiAmount);
        });
    }, [tokenAccountAddress]);

    return result;
}