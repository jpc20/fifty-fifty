import Raffle from "./Raffle";

const DeployedRaffles = ({ raffles, ticketPrice, requestAccount, userAddress }) => {
  const raffleComponents = raffles.map((raffleAddress) => {
    return (
      <Raffle
        raffleAddress={raffleAddress}
        key={raffleAddress}
        requestAccount={requestAccount}
        userAddress={userAddress}
      />
    );
  });
  return <div>{raffleComponents}</div>;
};

export default DeployedRaffles;
