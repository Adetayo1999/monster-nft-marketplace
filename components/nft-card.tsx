import { useMemo, useState } from "react";
import { ethers } from "ethers";
import axios from "axios";
import {
  useNetwork,
  useContractRead,
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import toast from "react-hot-toast";
import mappings from "../constants/mappings.json";
import { MappingTypes, NFTCardProps } from "../types";
import marketPlaceABI from "../constants/market-place-abi.json";
import monsterNFTABI from "../constants/monster-nft-abi.json";

export const NFTCard = ({ price, seller, tokenId }: NFTCardProps) => {
  const { chain } = useNetwork();
  const { address, isConnected } = useAccount();
  const chainID = useMemo(() => chain?.id || "5", [chain?.id]);
  const networkMappings: MappingTypes = mappings;
  const networkAddresses = networkMappings[chainID];
  const [loading, setLoading] = useState(false);
  const [metaData, setMetaData] = useState<any>({});

  const { config: buyItemConfig } = usePrepareContractWrite({
    address: networkAddresses?.nftMarketPlaceAddress,
    abi: marketPlaceABI,
    functionName: "buyItem",
    args: [tokenId, networkAddresses?.monsterNFTAddress],
    overrides: {
      value: ethers.utils.parseEther(ethers.utils.formatUnits(price, "ether")),
    },
  });

  const { config: cancelItemConfig } = usePrepareContractWrite({
    address: networkAddresses?.nftMarketPlaceAddress,
    abi: marketPlaceABI,
    functionName: "cancelListing",
    args: [tokenId, networkAddresses?.monsterNFTAddress],
    overrides: {
      from: address,
    },
  });

  const {
    write,
    isLoading: isHandleBuyItemLoading,
    data: buyItemReturnData,
  } = useContractWrite({
    ...buyItemConfig,
    onSuccess() {
      toast.success(
        "Transaction Created... waiting for confirmations...do not refresh browser"
      );
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  const {
    write: cancelItemWrite,
    isLoading: isHandleCancelItemLoading,
    data: cancelItemReturnData,
  } = useContractWrite({
    ...cancelItemConfig,
    onSuccess() {
      toast.success(
        "Transaction Created... waiting for confirmations...do not refresh browser"
      );
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  const { isLoading: isBuyItemConfirmationLoading } = useWaitForTransaction({
    hash: buyItemReturnData?.hash,
    confirmations: 2,
    onSuccess() {
      toast.success("NFT Bought");
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  const { isLoading: isCancelItemConfirmationLoading } = useWaitForTransaction({
    hash: cancelItemReturnData?.hash,
    confirmations: 2,
    onSuccess() {
      toast.success("NFT Cancelled");
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  const handleBuyItem = async () => {
    try {
      write?.();
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancelItem = async () => {
    try {
      cancelItemWrite?.();
    } catch (error) {
      console.log(error);
    }
  };

  const { data, isLoading } = useContractRead({
    address: networkAddresses?.monsterNFTAddress,
    functionName: "tokenURI",
    args: [tokenId],
    abi: monsterNFTABI,
    async onSuccess() {
      try {
        if (typeof data !== "string") return;
        setLoading(true);
        const url = data.replace("ipfs://", "https://ipfs.io/ipfs/");
        const { data: axiosData } = await axios.get(url);
        setMetaData(axiosData);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="bg-white rounded shadow-md w-full sm:w-[18rem] h-[20rem] cursor-pointer transition duration-300 hover:-translate-y-1 hover:shadow-xl overflow-hidden">
      <div
        className={`${
          (isLoading || loading) && "animate-pulse"
        } bg-slate-300 w-full h-[50%]`}
      >
        <img
          src={metaData?.image?.replace("ipfs://", "https://ipfs.io/ipfs/")}
          alt={metaData?.name}
          className="object-cover w-full h-full"
        />
      </div>
      <div className="p-5 text-slate-700 flex flex-col gap-y-2">
        <p className="text-xl font-semibold">{metaData?.name}</p>
        <div className="flex flex-col text-sm gap-y-1">
          <span>Price:</span>
          <span className="font-semibold">
            {ethers.utils.formatUnits(price, "ether") + "ETH"}
          </span>
        </div>
        <div className="">
          {seller.toLowerCase() === address?.toLowerCase() ? (
            <button
              className="text-sm px-4 py-2 rounded shadow-sm bg-red-600 text-slate-100 w-full font-medium transition hover:bg-red-700"
              onClick={handleCancelItem}
              disabled={!isConnected || chainID !== 5}
            >
              {isHandleCancelItemLoading || isCancelItemConfirmationLoading
                ? "Please wait"
                : "Cancel Listing"}
            </button>
          ) : (
            <button
              className={`text-sm px-4 py-2 rounded shadow-sm bg-purple-600 text-slate-100 w-full font-medium transition hover:bg-purple-700 ${
                (!isConnected || chainID !== 5) && "cursor-not-allowed"
              }`}
              onClick={handleBuyItem}
              disabled={!isConnected || chainID !== 5}
            >
              {isHandleBuyItemLoading || isBuyItemConfirmationLoading
                ? "Please wait"
                : "BUY"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export const NFTCardLoading = () => {
  return <p>Loading...</p>;
};
