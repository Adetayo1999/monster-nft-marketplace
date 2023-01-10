import type { NextPage } from "next";
import { NFTListings } from "../components/listings";
import { useNetwork } from "wagmi";
import { useEffect } from "react";
import { toast } from "react-hot-toast";

const Home: NextPage = () => {
  const { chain } = useNetwork();

  useEffect(() => {
    if (chain?.network && chain?.network !== "goerli") {
      toast.error("Only Goerli Testnet Supported");
    }
  }, [chain?.network]);

  return (
    <div className="">
      <NFTListings />
    </div>
  );
};

export default Home;
