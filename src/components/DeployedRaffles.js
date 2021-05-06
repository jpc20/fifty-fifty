import Raffle from "./Raffle";

const DeployedRaffles = ({ raffles, ticketPrice, requestAccount }) => {
  const raffleComponents = raffles.map((raffleAddress) => {
    return (
      <Raffle
        raffleAddress={raffleAddress}
        key={raffleAddress}
        ticketPrice={ticketPrice}
        requestAccount={requestAccount}
      />
    );
  });
  return <div>{raffleComponents}</div>;
};

export default DeployedRaffles;
