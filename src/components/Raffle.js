import { useState, useEffect } from "react";
import { ethers } from "ethers";
import RaffleContract from "../artifacts/contracts/Raffle.sol/Raffle.json";

const Raffle = ({ raffleAddress, getSignerAndProvider }) => {
  const [beneficiary, setBeneficiaryValue] = useState("");
  const [balance, setBalanceValue] = useState(0);
  const [userTicketCount, setUserTicketCountValue] = useState(0);
  const [raffleTicketPrice, setRaffleTickerPriceValue] = useState(0);

  useEffect(() => {
    const getRaffle = async () => {
      const [provider, signer, address] = await getSignerAndProvider();
      const deployedRaffle = new ethers.Contract(
        raffleAddress,
        RaffleContract.abi,
        signer
      );
      const raffleTicketPrice = await deployedRaffle.ticketPrice();
      const raffleBeneficiary = await deployedRaffle.beneficiary();
      const ticketCount = await deployedRaffle.ticketCount(address);
      const contractBalance = await provider.getBalance(raffleAddress);
      setRaffleTickerPriceValue(
        ethers.utils.formatEther(raffleTicketPrice.toString())
      );
      setUserTicketCountValue(ticketCount.toNumber());
      setBeneficiaryValue(raffleBeneficiary);
      setBalanceValue(ethers.utils.formatEther(contractBalance.toString()));
    };
    getRaffle();
  }, [getSignerAndProvider, raffleAddress, userTicketCount, balance]);

  async function purchaseTicket() {
    const [provider, signer, address] = await getSignerAndProvider();
    const deployedRaffle = new ethers.Contract(
      raffleAddress,
      RaffleContract.abi,
      signer
    );
    const ethTicketPrice = ethers.utils.parseEther(
      raffleTicketPrice.toString()
    );
    try {
      const purchaseTx = await deployedRaffle.purchaseTicket({
        from: address,
        value: ethTicketPrice,
      });
      provider.once(purchaseTx.hash, (transaction) => {
        setUserTicketCountValue(userTicketCount + 1);
      });
    } catch (error) {
      console.log(error);
    }
  }

  async function distributeFunds() {
    const [provider, signer, address] = await getSignerAndProvider();
    const deployedRaffle = new ethers.Contract(
      raffleAddress,
      RaffleContract.abi,
      signer
    );
    try {
      await deployedRaffle.distribute();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <button onClick={purchaseTicket}>Purchase Ticket</button>
      <button onClick={distributeFunds}>Distribute Funds</button>
      Ticket Price: {raffleTicketPrice} ETH, Balance: {balance} ETH,
      Beneficiary: {beneficiary.slice(0, 5)}... TicketsOwned: {userTicketCount}
    </div>
  );
};

export default Raffle;
