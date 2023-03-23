import {YieldControllerClient} from "@sunrisestake/yield-controller";
import {useAnchorWallet, useConnection} from "@solana/wallet-adapter-react";
import {useEffect, useState} from "react";
import {AnchorProvider} from "@coral-xyz/anchor";
import {PublicKey} from "@solana/web3.js";

const stateAddress = new PublicKey("DzyP73X4TWnh5jarfjapaNBxtjeEVsfknWVfToRYARDL");

export const useYieldController = () => {
    const {connection} = useConnection();
    const wallet = useAnchorWallet();
    const [client, setClient] = useState<YieldControllerClient>();

    useEffect(() => {
        if (!wallet) return;

        const provider = new AnchorProvider(
            connection,
            wallet,
            {}
        );
        YieldControllerClient.get(
            provider,
            stateAddress
        ).then(setClient)
    }, [wallet]);

    const allocateYield = async () => {
        if (!client || !wallet) return;
        await client.allocateYield(wallet.publicKey);
    }


    return {
        state: client?.state,
        allocateYield
    }
}