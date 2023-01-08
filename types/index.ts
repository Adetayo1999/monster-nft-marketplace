export type NFTCardProps = {
  id: string;
  buyer: string;
  nftAddress: string;
  price: string;
  seller: string;
  tokenId: string;
};

export type MappingTypes = {
  [key: string]: {
    nftMarketPlaceAddress: string;
    monsterNFTAddress: string;
  };
};
