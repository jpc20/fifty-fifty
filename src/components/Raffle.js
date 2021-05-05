import { useState, useEffect } from "react";
import { ethers } from "ethers";
import RaffleContract from "../artifacts/contracts/Raffle.sol/Raffle.json";

const Raffle = ({ raffleAddress }) => {
  const [raffle, setRaffleValue] = useState({});
  
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
    setRaffleValue(deployedRaffle);
  });
  
  return (
    <div>
        Test
    </div>
  );
}

export default Raffle;
