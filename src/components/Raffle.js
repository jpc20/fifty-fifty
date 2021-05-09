import { useState, useEffect } from "react";
import { ethers } from "ethers";
import RaffleContract from "../artifacts/contracts/Raffle.sol/Raffle.json";

const Raffle = ({ raffleAddress, userAddress, getSignerAndProvider }) => {
  const [beneficiary, setBeneficiaryValue] = useState("");
  const [balance, setBalanceValue] = useState("");
  const [userTicketCount, setUserTicketCountValue] = useState("");
  const [raffleTicketPrice, setRaffleTickerPriceValue] = useState("");

  useEffect(async () => {
    const [provider, signer, address] = await getSignerAndProvider();
    const deployedRaffle = new ethers.Contract(
      raffleAddress,
      RaffleContract.abi,
      signer
    );
    const raffleTicketPrice = await deployedRaffle.ticketPrice();
    const raffleBeneficiary = await deployedRaffle.beneficiary();
    const ticketCount = await deployedRaffle.ticketCount(userAddress);
    const contractBalance = await provider.getBalance(raffleAddress);
    setRaffleTickerPriceValue(
      ethers.utils.formatEther(raffleTicketPrice.toString())
    );
    setUserTicketCountValue(ticketCount.toString());
    setBeneficiaryValue(raffleBeneficiary);
    setBalanceValue(ethers.utils.formatEther(contractBalance.toString()));
  }, [getSignerAndProvider, raffleAddress, userAddress, userTicketCount]);

  async function purchaseTicket() {
    const [provider, signer, address] = await getSignerAndProvider();
    const deployedRaffle = new ethers.Contract(
      raffleAddress,
      RaffleContract.abi,
      signer
    );
    const ethTicketPrice = ethers.utils.parseEther(raffleTicketPrice.toString());
    try {
      await deployedRaffle.purchaseTicket({
        from: userAddress,
        value: ethTicketPrice,
      });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <button onClick={purchaseTicket}>Purchase Ticket</button>
      Ticket Price: {raffleTicketPrice} ETH, Balance: {balance} ETH, Beneficiary:{" "}
      {beneficiary.slice(0, 5)}... TicketsOwned: {userTicketCount}
    </div>
  );
};

export default Raffle;
