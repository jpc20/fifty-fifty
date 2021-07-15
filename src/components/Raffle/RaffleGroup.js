import Raffle from "./Raffle";

const FILTER_MAP = {
  open: (raffle) => raffle.openStatus,
  tickets: (raffle) => raffle.userTicketCount > 0,
  owned: (raffle) => raffle.owner,
};

const SORT_MAP = {
  date: (a, b) => b.index - a.index,
  dateReverse: (a, b) => a.index - b.index,
  balance: (a, b) => b.balance - a.balance,
  balanceReverse: (a, b) => a.balance - b.balance,
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
  raffleFactoryAddress,
  sortBy
}) => {
  const filtered = raffles
    .sort(SORT_MAP[sortBy])
    .filter(FILTER_MAP[filter])
    .map((raffle) => {
      return (
        <Raffle
          raffleTicketPrice={raffle.ticketPrice}
          beneficiary={raffle.beneficiary}
          description={raffle.description}
          userTicketCount={raffle.userTicketCount}
          totalTicketCount={raffle.totalTicketCount}
          balance={raffle.balance}
          isOwner={raffle.owner}
          isAdmin={raffle.isAdmin}
          open={raffle.openStatus}
          raffleAddress={raffle.raffleAddress}
          ticketsAddress={raffle.ticketsAddress}
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
          raffleFactoryAddress={raffleFactoryAddress}
          distributeTx={raffle.distributeTx}
        />
      );
    });
  return filtered;
};

export default RaffleGroup;
