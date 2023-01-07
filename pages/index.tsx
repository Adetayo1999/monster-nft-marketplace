import type { NextPage } from "next";
import { Header } from "../components/header";

const Home: NextPage = () => {
  return (
    <div className="min-h-screen bg-slate-200">
      <Header />
      <div className="w-[90%] mx-auto"></div>
    </div>
  );
};

export default Home;
