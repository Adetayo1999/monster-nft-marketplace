import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";

export const Header = () => {
  return (
    <header className=" p-5 bg-white   shadow-md">
      <div className="md:w-[90%] flex justify-between items-center mx-auto">
        <Link href="/" className="flex justify-center gap-x-3 items-center">
          <h4 className="text-lg md:text-2xl font-bold text-purple-600">
            Market Place
          </h4>
        </Link>
        <div className="">
          <ConnectButton />
        </div>
      </div>
    </header>
  );
};
