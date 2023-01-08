import { NFTCard, NFTCardLoading } from "./nft-card";
import { NFTCardProps } from "../types";
import { useListing } from "../context/listing-context";

export const NFTListings = () => {
  const { data, loading } = useListing();

  if (loading) {
    return (
      <div className="flex gap-5">
        {[1, 2, 3, 4, 5, 6].map((_, index) => (
          <NFTCardLoading key={index} />
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-5">
      {data?.activeItems?.map((item: NFTCardProps) => (
        <NFTCard key={item.id} {...item} />
      ))}
    </div>
  );
};
