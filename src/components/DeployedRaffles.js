import Raffle from "./Raffle";

const DeployedRaffles = ({ raffles, ticketPrice }) => {
  const raffleComponents = raffles.map((raffleAddress) => {
    return (
      <Raffle
        raffleAddress={raffleAddress}
        key={raffleAddress}
        ticketPrice={ticketPrice}
      />
    );
  });
  return <div>{raffleComponents}</div>;
};

export default DeployedRaffles;
