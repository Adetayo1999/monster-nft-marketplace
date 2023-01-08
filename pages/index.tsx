import type { NextPage } from "next";
import { NFTListings } from "../components/listings";

const Home: NextPage = () => {
  return (
    <div className="">
      <NFTListings />
    </div>
  );
};

export default Home;
