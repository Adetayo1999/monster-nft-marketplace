import { createContext, useState, useCallback, useContext } from "react";

type ListingModalContext = {
  setModalStatus: (status: "close" | "update" | "create") => void;
  tokenId: string | null;
  modalStatus: "close" | "update" | "create";
  setTokenId: (tokenId: string) => void;
};

const ListingModalContext = createContext({} as ListingModalContext);

type ListingModalProviderProps = {
  children: any;
};

const ListingModalProvider = ({ children }: ListingModalProviderProps) => {
  const [modalStatus, setModalStatus] = useState<"close" | "update" | "create">(
    "close"
  );
  const [tokenId, setTokenId] = useState<string | null>(null);

  return (
    <ListingModalContext.Provider
      value={{ modalStatus, setModalStatus, setTokenId, tokenId }}
    >
      {children}
    </ListingModalContext.Provider>
  );
};

export const useListingModal = () => useContext(ListingModalContext);

export default ListingModalProvider;
