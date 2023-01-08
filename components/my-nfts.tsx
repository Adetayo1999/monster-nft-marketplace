import { useEffect } from "react";
import { useAccount, useContractRead } from "wagmi";
import { useQuery, gql, ApolloClient, InMemoryCache } from "@apollo/client";
import toast from "react-hot-toast";
import { MyNFT } from "./my-nft";

const GET_MY_NFTS = gql`
  query MonsterNFTNFTMinteds($buyer: String!) {
    monsterNFTNFTMinteds(where: { buyer: $buyer }) {
      id
      tokenId
      buyer
    }
  }
`;

const customClient = new ApolloClient({
  uri: "https://api.studio.thegraph.com/query/40062/monster-nft/1.2.0",
  cache: new InMemoryCache(),
});

export const MyNFTs = () => {
  const { address } = useAccount();

  const { data, loading, error } = useQuery(GET_MY_NFTS, {
    variables: { buyer: address },
    client: customClient,
  });

  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
  }, [error]);

  if (loading) {
    return (
      <div className="">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex gap-5 flex-wrap justify-center sm:justify-start mb-10">
      {data?.monsterNFTNFTMinteds?.map((item: any) => (
        <MyNFT key={item.id} tokenId={item.tokenId} />
      ))}
      {data?.monsterNFTNFTMinteds?.length === 0 && (
        <p className="text-left w-full">You Don't Have NFTs</p>
      )}
    </div>
  );
};
