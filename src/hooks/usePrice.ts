import Big from "big.js";
import {useEffect, useState} from "react";
import {PublicKey} from "@solana/web3.js";
import {useSwitchboard} from "./useSwitchboard";

export const usePrice = () => {
  const [solPrice, setSolPrice] = useState<Big>();
  const [nctPrice, setNctPrice] = useState<Big>();
  const [solNctPrice, setSolNctPrice] = useState<Big>();

  const solPriceFeed = useSwitchboard(new PublicKey("GvDMxPzN1sCj7L26YDK2HnMRXEQmQ2aemov8YBtPS7vR"));
  const nctPriceFeed = useSwitchboard(new PublicKey("4YL36VBtFkD2zfNGWdGFSc5suvskjrHnx3Asuksyek1J"));

  useEffect(() => {
    if (solPriceFeed && nctPriceFeed) {
      setSolPrice(solPriceFeed);
      setNctPrice(nctPriceFeed);
      setSolNctPrice(solPriceFeed.div(nctPriceFeed));
    }
  }, [solPriceFeed, nctPriceFeed]);

  return {solPrice, nctPrice, solNctPrice};
};