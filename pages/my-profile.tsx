import { NextPage } from "next";
import { MyNFTs } from "../components/my-nfts";

const Profile: NextPage = () => {
  return (
    <div className="">
      <h1 className="mb-4 font-semibold text-slate-800">My NFTS</h1>
      <MyNFTs />
    </div>
  );
};

export default Profile;

/*
- we have the listing and cancel listing in place
- now we need where we can update listing and show your nfts

without indexing
- get user's balance O(1)
- get tokenIdByIndex from the loop O(n)

- get tokenURI using tokenId
- use axios to connect to ipfs
- fetch image from ipfs


with indexing
- get the indexed events


- get tokenURI using tokenId
- use axios to connect to ipfs
- fetch image from ipfs 

*/
