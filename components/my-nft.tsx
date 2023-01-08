import { useMemo, useState } from "react";
// import { ethers } from "ethers";
import axios from "axios";
import { useNetwork, useContractRead } from "wagmi";
import mappings from "../constants/mappings.json";
// import marketPlaceABI from "../constants/market-place-abi.json";
import monsterNFTABI from "../constants/monster-nft-abi.json";
import { useListing } from "../context/listing-context";
import { useListingModal } from "../context/listing-modal";

type MyNFTProps = {
  tokenId: string;
};

type MappingTypes = {
  [key: string]: {
    nftMarketPlaceAddress: string;
    monsterNFTAddress: string;
  };
};

export const MyNFT = ({ tokenId }: MyNFTProps) => {
  const { chain } = useNetwork();
  const chainID = useMemo(() => chain?.id || "5", [chain?.id]);
  const networkMappings: MappingTypes = mappings;
  const { monsterNFTAddress } = networkMappings[chainID];
  const [loading, setLoading] = useState(false);
  const [metaData, setMetaData] = useState<any>({});
  const { data: listingData, loading: loadingListingData } = useListing();
  const { setModalStatus, setTokenId } = useListingModal();

  const { data, isLoading } = useContractRead({
    address: monsterNFTAddress,
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

  const isListed = (): boolean => {
    return listingData?.activeItems?.find(
      (item: any) => item.tokenId === tokenId
    );
  };

  return (
    <div className="bg-white rounded shadow-md w-full sm:w-[15rem] md:w-[18rem]  h-[18rem]  cursor-pointer transition duration-300 hover:-translate-y-1 hover:shadow-xl overflow-hidden">
      <div
        className={`${
          (isLoading || loading) && "animate-pulse"
        } bg-slate-300 w-full h-[65%]`}
      >
        <img
          src={metaData?.image?.replace("ipfs://", "https://ipfs.io/ipfs/")}
          alt={metaData?.name}
          className="object-cover w-full h-full"
        />
      </div>
      <div className="p-5 text-slate-700 flex flex-col gap-y-2">
        {isLoading || loading ? (
          <div className="w-[50%] h-4  px-6 bg-slate-300 animate-pulse round" />
        ) : (
          <p className="text-lg font-semibold">{metaData?.name}</p>
        )}
        <div className="">
          {isLoading || loading || loadingListingData ? (
            <p>Please wait...</p>
          ) : (
            <div>
              {isListed() ? (
                <button
                  className="text-sm px-4 py-2 rounded shadow-sm bg-blue-600 text-slate-100 w-full font-medium transition hover:bg-blue-700"
                  onClick={() => {
                    setTokenId(tokenId);
                    setModalStatus("update");
                  }}
                >
                  Update {metaData?.name}
                </button>
              ) : (
                <button
                  className="text-sm px-4 py-2 rounded shadow-sm bg-purple-600 text-slate-100 w-full font-medium transition hover:bg-purple-700"
                  onClick={() => {
                    setTokenId(tokenId);
                    setModalStatus("create");
                  }}
                >
                  List {metaData?.name}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
