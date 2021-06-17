import Raffle from "./Raffle";

const FILTER_MAP = {
  open: (raffle) => raffle.openStatus,
  tickets: (raffle) => raffle.userTicketCount > 0,
  owned: (raffle) => raffle.owner,
};

const RaffleGroup = ({
  raffles,
  filter,
  getRaffles,
  signer,
  provider,
  userAddress,
  userConnected,
  setFlashActive,
  setFlashMessage,
  setFlashType,
}) => {
  const filtered = raffles.filter(FILTER_MAP[filter]).map((raffle) => {
    return (
      <Raffle
        raffleTicketPrice={raffle.ticketPrice}
        beneficiary={raffle.beneficiary}
        description={raffle.description}
        userTicketCount={raffle.userTicketCount}
        totalTicketCount={raffle.totalTicketCount}
        balance={raffle.balance}
        isOwner={raffle.owner}
        open={raffle.openStatus}
        raffleAddress={raffle.raffleAddress}
        key={raffle.raffleAddress}
        raffleFilter={filter}
        getRaffles={getRaffles}
        signer={signer}
        provider={provider}
        userAddress={userAddress}
        userConnected={userConnected}
        setFlashActive={setFlashActive}
        setFlashMessage={setFlashMessage}
        setFlashType={setFlashType}
      />
    );
  });
  return filtered;
};

export default RaffleGroup;
