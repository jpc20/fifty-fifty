import Raffle from "./Raffle";

const DeployedRaffles = ({ raffles, requestAccount, userAddress, getSignerAndProvider }) => {
  const raffleComponents = raffles.map((raffleAddress) => {
    return (
      <Raffle
        raffleAddress={raffleAddress}
        key={raffleAddress}
        requestAccount={requestAccount}
        userAddress={userAddress}
        getSignerAndProvider={getSignerAndProvider}
      />
    );
  });
  return <div>{raffleComponents}</div>;
};

export default DeployedRaffles;
