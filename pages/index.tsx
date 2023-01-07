import type { NextPage } from "next";
import { useQuery, gql } from "@apollo/client";
import { Header } from "../components/header";

const GET_ACTIVE_NFTS = gql`
  {
    activeItems(
      first: 5
      where: { buyer: "0x0000000000000000000000000000000000000000" }
    ) {
      id
      seller
      buyer
      tokenId
      nftAddress
      price
    }
  }
`;

const Home: NextPage = () => {
  const { data } = useQuery(GET_ACTIVE_NFTS);

  console.log(data);

  return (
    <div className="min-h-screen bg-slate-200">
      <Header />
      <div className="w-[90%] mx-auto"></div>
    </div>
  );
};

export default Home;
