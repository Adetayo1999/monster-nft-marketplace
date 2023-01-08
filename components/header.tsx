import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";

export const Header = () => {
  return (
    <>
      <header className=" p-5 bg-white   shadow-md  fixed top-0 w-full h-[5rem] z-50 ">
        <div className="md:w-[90%] flex justify-between items-center mx-auto">
          <Link href="/" className="flex justify-center gap-x-3 items-center">
            <a>
              <h4 className="text-lg md:text-2xl font-bold text-purple-600">
                Market Place
              </h4>
            </a>
          </Link>
          <nav className="hidden sm:block">
            <ul className="flex gap-x-4">
              {[
                { id: 1, name: "Home", path: "/" },
                { id: 2, name: "My Profile", path: "/my-profile" },
              ].map((item) => (
                <li key={item.id}>
                  <Link href={item.path}>
                    <a>{item.name}</a>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="">
            <ConnectButton />
          </div>
        </div>
      </header>
      <div className="mb-[7rem]" />
    </>
  );
};
