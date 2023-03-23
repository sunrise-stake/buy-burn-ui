import {PublicKey} from "@solana/web3.js";
import Big from "big.js";
import {useEffect, useState} from "react";
import {useConnection} from "@solana/wallet-adapter-react";

export const useSolBalance = (address: PublicKey) => {
    const {connection} = useConnection();
    const [result, setResult] = useState<number | null>(null);

    useEffect(() => {
        void (async () => {
            const balance = await connection.getBalance(address);
            setResult(balance);
        })();
    }, [address]);

    return result;
}