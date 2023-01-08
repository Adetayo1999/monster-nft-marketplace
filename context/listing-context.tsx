import { useEffect, createContext, useContext } from "react";
import { useQuery, gql, ApolloError } from "@apollo/client";

type ListingContextType = {
  data: any;
  loading: boolean;
};

const ListingContext = createContext({} as ListingContextType);

type ListingProviderProps = {
  children: any;
};

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

const ListingProvider = ({ children }: ListingProviderProps) => {
  const { data, loading, error } = useQuery(GET_ACTIVE_NFTS);

  useEffect(() => {
    if (error instanceof ApolloError) {
      console.log(error.message);
    }
  }, [error]);

  return (
    <ListingContext.Provider value={{ data, loading }}>
      {children}
    </ListingContext.Provider>
  );
};

export const useListing = () => useContext(ListingContext);

export default ListingProvider;
