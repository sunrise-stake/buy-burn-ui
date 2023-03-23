import Big from "big.js";
import { AggregatorAccount, SwitchboardProgram, TransactionObject } from "@switchboard-xyz/solana.js";
import {Connection, PublicKey} from "@solana/web3.js";
import {useConnection} from "@solana/wallet-adapter-react";
import {useEffect, useState} from "react";


export const useSwitchboard = (aggregatorPubkey: PublicKey) => {
    const {connection} = useConnection();
    const [result, setResult] = useState<Big | null>(null);

    useEffect(() => {
        void (async () => {
            const program = await SwitchboardProgram.load(
                "mainnet-beta",
                connection
            );
            const aggregatorAccount = new AggregatorAccount(program, aggregatorPubkey);

            console.log("fetching...")
            const value: Big | null = await aggregatorAccount.fetchLatestValue();
            console.log("switchboard", value);
            if (value === null) {
                throw new Error("Aggregator holds no value");
            }
            setResult(value);
        })();
    }, []);

    return result;
}