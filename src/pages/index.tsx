import { NextPage } from "next";
import { trpc } from "@/utils/trpc";
import { getOptionsForVote } from "@/utils/getRandomPokemon";
import { useMemo } from "react";

const Home: NextPage = () => {
  const [first, second] = useMemo(() => getOptionsForVote(), []);
  const firstPokemon = trpc.useQuery(["get-pokemon-by-id", { id: first }]);
  const secondPokemon = trpc.useQuery(["get-pokemon-by-id", { id: second }]);

  if (firstPokemon.isLoading || secondPokemon.isLoading) return null;

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      <div className="text-2xl text-center">Which Pokemon is rounder?</div>
      <div className="p-2"></div>
      <div className="border rounded p-8 flex justify-between max-w-2xl items-center">
        <div className="w-64 h-64 flex flex-col">
          <img
            className="w-full"
            src={firstPokemon.data?.sprites.front_default || undefined}
          />
          <div className="text-xl text-center capitalize mt-[-2rem]">
            {firstPokemon.data?.name}
          </div>
        </div>
        <div className="p-8">Vs</div>
        <div className="w-64 h-64 flex flex-col">
          <img
            className="w-full"
            src={secondPokemon.data?.sprites.front_default || undefined}
          />
          <div className="text-xl text-center capitalize mt-[-2rem]">
            {secondPokemon.data?.name}
          </div>
        </div>
        <div className="p-2"></div>
      </div>
    </div>
  );
};

export default Home;
