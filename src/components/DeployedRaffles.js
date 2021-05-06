import Raffle from "./Raffle";

const DeployedRaffles = ({ raffles }) => {
  const raffleComponents = raffles.map((raffleAddress) => {
    return <Raffle raffleAddress={raffleAddress} key={raffleAddress} />;
  });
  return (
    <div>
      {raffleComponents}
    </div>
  );
};

export default DeployedRaffles;
