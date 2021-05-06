import { useState, useEffect } from "react";
import { ethers } from "ethers";
import RaffleContract from "../artifacts/contracts/Raffle.sol/Raffle.json";

const Raffle = ({ raffleAddress }) => {
  const [ticketPrice, setTicketPriceValue] = useState('Loading...');
  const [beneficiary, setBeneficiaryValue] = useState('');
  const [balance, setBalanceValue] = useState('');

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
    const formattedPrice = ethers.utils.formatEther(raffleTicketPrice.toString());
    const contractBalance = await provider.getBalance(raffleAddress)
    setTicketPriceValue(formattedPrice);
    setBeneficiaryValue(raffleBeneficiary);
    setBalanceValue(ethers.utils.formatEther(contractBalance.toString()));
  });

  
  return (
    <div>
      Ticket Price: {ticketPrice} ETH, Balance: {balance} ETH, Beneficiary: {beneficiary.slice(0, 10)}...
    </div>
  );
}

export default Raffle;
