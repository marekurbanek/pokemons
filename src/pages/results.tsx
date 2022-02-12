import { GetServerSideProps } from "next";
import { prisma } from "@/backend/utils/prisma";
import { AsyncReturnType } from "@/utils/AsyncReturnType";
import Image from "next/image";

type PokemonQueryResult = AsyncReturnType<typeof getPokemonOrdered>;

const generateCountPercent = (pokemon: PokemonQueryResult[number]) => {
  const { VotesFor, VoteAgainst } = pokemon._count;
  if (VotesFor + VoteAgainst === 0) return 0;

  return (VotesFor / (VotesFor + VoteAgainst)) * 100;
};

const PokemonListing: React.FC<{ pokemon: PokemonQueryResult[number] }> = (
  props
) => {
  return (
    <div className="flex border-b p-2 items-center justify-between">
      <div className="flex items-center">
        <Image
          width={64}
          height={64}
          src={props.pokemon.spriteUrl}
          layout="fixed"
        />
        <div className="capitalize">{props.pokemon.name}</div>
      </div>
      <div>{generateCountPercent(props.pokemon)}%</div>
    </div>
  );
};

const ResultsPage: React.FC<{
  pokemon: PokemonQueryResult;
}> = (props) => {
  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl p-4">Results</h2>
      <div className="flex flex-col w-full max-w-2xl border">
        {props.pokemon.map((pokemon) => (
          <PokemonListing pokemon={pokemon} key={pokemon.id} />
        ))}
      </div>
    </div>
  );
};

export default ResultsPage;

const getPokemonOrdered = async () => {
  return await prisma.pokemon.findMany({
    orderBy: { VotesFor: { _count: "desc" } },
    select: {
      id: true,
      name: true,
      spriteUrl: true,
      _count: { select: { VotesFor: true, VoteAgainst: true } },
    },
  });
};

export const getStaticProps: GetServerSideProps = async () => {
  const pokemonOrdered = await getPokemonOrdered();

  return { props: { pokemon: pokemonOrdered }, revalidate: 60 };
};
