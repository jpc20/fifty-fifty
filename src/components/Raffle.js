import { useState, useEffect } from "react";
import { ethers } from "ethers";
import RaffleContract from "../artifacts/contracts/Raffle.sol/Raffle.json";

const Raffle = ({ raffleAddress, ticketPrice }) => {
  const [beneficiary, setBeneficiaryValue] = useState("");
  const [balance, setBalanceValue] = useState("");
  const [userAddress, setUserAddressValue] = useState("");
  const [userTicketCount, setUserTicketCountValue] = useState("");

  async function requestAccount() {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }

  useEffect(async () => {
    await requestAccount();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const deployedRaffle = new ethers.Contract(
      raffleAddress,
      RaffleContract.abi,
      signer
    );
    const raffleTicketPrice = await deployedRaffle.ticketPrice();
    const raffleBeneficiary = await deployedRaffle.beneficiary();
    const address = await signer.getAddress();
    const ticketCount = await deployedRaffle.ticketCount(address);
    const contractBalance = await provider.getBalance(raffleAddress);
    setUserAddressValue(address);
    setUserTicketCountValue(ticketCount.toString());
    setBeneficiaryValue(raffleBeneficiary);
    setBalanceValue(ethers.utils.formatEther(contractBalance.toString()));
  });

  async function purchaseTicket() {
    await requestAccount();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const deployedRaffle = new ethers.Contract(
      raffleAddress,
      RaffleContract.abi,
      signer
    );
    const ethTicketPrice = ethers.utils.parseEther(ticketPrice.toString());
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
      Ticket Price: {ticketPrice} ETH, Balance: {balance} ETH, Beneficiary:{" "}
      {beneficiary.slice(0, 5)}... TicketsOwned: {userTicketCount}
    </div>
  );
};

export default Raffle;
