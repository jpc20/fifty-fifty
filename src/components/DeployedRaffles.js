import Raffle from "./Raffle";

const DeployedRaffles = ({ raffles }) => {
  return (
    <div>
      {raffles.map((raffleAddress) => {
        return <Raffle raffleAddress={raffleAddress} key={raffleAddress} />;
      })}
    </div>
  );
};

export default DeployedRaffles;
