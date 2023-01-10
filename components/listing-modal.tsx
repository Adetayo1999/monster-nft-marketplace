import { Dialog, Transition } from "@headlessui/react";
import { ethers, BigNumber } from "ethers";
import { Fragment, useState, useMemo } from "react";
import toast from "react-hot-toast";
import {
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import mappings from "../constants/mappings.json";
import marketPlaceABI from "../constants/market-place-abi.json";
import monsterNFTABI from "../constants/monster-nft-abi.json";
import { useListingModal } from "../context/listing-modal";
import { MappingTypes } from "../types";

export const ListingModal = () => {
  const { chain } = useNetwork();
  const [price, setPrice] = useState("");
  const { modalStatus, setModalStatus, tokenId } = useListingModal();
  const chainID = useMemo(() => chain?.id || "5", [chain?.id]);
  const networkMappings: MappingTypes = mappings;
  const networkAddresses = networkMappings[chainID];

  const isOpen = modalStatus === "create" || modalStatus === "update";
  const closeModal = () => setModalStatus("close");

  const { config: approveItemConfig } = usePrepareContractWrite({
    address: networkAddresses?.monsterNFTAddress,
    abi: monsterNFTABI,
    functionName: "approve",
    args: [networkAddresses?.nftMarketPlaceAddress, tokenId],
  });

  const { config: listItemConfig } = usePrepareContractWrite({
    address: networkAddresses?.nftMarketPlaceAddress,
    abi: marketPlaceABI,
    functionName: "listItem",
    args: [
      tokenId,
      networkAddresses?.monsterNFTAddress,
      ethers.utils.parseEther(price || "0"),
    ],
  });

  const { config: updateItemConfig } = usePrepareContractWrite({
    address: networkAddresses?.nftMarketPlaceAddress,
    abi: marketPlaceABI,
    functionName: "updateListing",
    args: [
      ethers.utils.parseEther(price || "0"),
      tokenId,
      networkAddresses?.monsterNFTAddress,
    ],
  });

  const {
    write: approveItem,
    isLoading: isApproveItemLoading,
    data: approveItemReturnData,
  } = useContractWrite({
    ...approveItemConfig,
    onSuccess() {
      toast.success(
        "Transaction Created... waiting for confirmations...do not refresh browser"
      );
    },
    onError(error) {
      toast.error(error.message);
      setModalStatus("close");
    },
  });

  const {
    write: listItem,
    isLoading: isListItemLoading,
    data: listItemReturnData,
  } = useContractWrite({
    ...listItemConfig,
    onSuccess() {
      toast.success(
        "Transaction Created... waiting for confirmations...do not refresh browser"
      );
    },
    onError(error) {
      toast.error(error.message);
      setModalStatus("close");
    },
  });

  const {
    write: updateItem,
    isLoading: isUpdateItemLoading,
    data: updateItemReturnData,
  } = useContractWrite({
    ...updateItemConfig,
    onSuccess() {
      toast.success(
        "Transaction Created... waiting for confirmations...do not refresh browser"
      );
    },
    onError(error) {
      toast.error(error.message);
      setModalStatus("close");
    },
  });

  const { isLoading: isListItemConfirmationLoading } = useWaitForTransaction({
    hash: listItemReturnData?.hash,
    // confirmations: 2,
    onSuccess() {
      toast.success("NFT Listed");
      setModalStatus("close");
    },
    onError(error) {
      toast.error(error.message);
      setModalStatus("close");
    },
  });

  const { isLoading: isUpdateItemConfirmationLoading } = useWaitForTransaction({
    hash: updateItemReturnData?.hash,
    // confirmations: 2,
    onSuccess() {
      toast.success("NFT Updated");
      setModalStatus("close");
    },
    onError(error) {
      toast.error(error.message);
      setModalStatus("close");
    },
  });

  const { isLoading: isApproveItemConfirmationLoading } = useWaitForTransaction(
    {
      hash: approveItemReturnData?.hash,
      //   confirmations: 2,
      onSuccess() {
        toast.success("NFT Approved For Sale");
        listItem?.();
      },
      onError(error) {
        toast.error(error.message);
        setModalStatus("close");
      },
    }
  );

  const handleListItem = () => {
    try {
      approveItem?.();
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateItem = () => {
    try {
      updateItem?.();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  {modalStatus === "create"
                    ? "Create"
                    : modalStatus === "update" && "Update"}{" "}
                  Listing
                </Dialog.Title>
                <div className="mt-4">
                  <input
                    type="text"
                    className="w-full outline-none border border-slate-200 rounded p-2 text-sm transition duration-200 
                     focus:ring-4 focus:ring-purple-600 focus:ring-opacity-30
                    "
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Enter Listing Price"
                  />
                </div>

                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-purple-100 px-4 py-2 text-sm font-medium text-purple-900 hover:bg-purple-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 capitalize cursor-pointer"
                    onClick={
                      modalStatus === "create"
                        ? handleListItem
                        : modalStatus === "update"
                        ? handleUpdateItem
                        : undefined
                    }
                    disabled={!price}
                  >
                    {modalStatus}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
