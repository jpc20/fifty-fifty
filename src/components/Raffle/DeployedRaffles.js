import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import RaffleFactory from "../../artifacts/contracts/Raffle.sol/RaffleFactory.json";
import RaffleTabs from "./RaffleTabs";
import RaffleContract from "../../artifacts/contracts/Raffle.sol/Raffle.json";

const DeployedRaffles = ({
  raffleFactoryAddress,
  checkNetwork,
  signer,
  provider,
  userAddress,
  userConnected,
  apiConnected,
}) => {
  const [raffles, setRafflesValue] = useState([]);

  const getRaffles = useCallback(async () => {
    if (userConnected === false && apiConnected === false) return;
    try {
      setRafflesValue([]);
      const factory = new ethers.Contract(
        raffleFactoryAddress,
        RaffleFactory.abi,
        signer
      );
      const rafflesAddresses = await factory.getDeployedRaffles();
      rafflesAddresses.forEach(async (raffleAddress) => {
        const deployedRaffle = new ethers.Contract(
          raffleAddress,
          RaffleContract.abi,
          signer
        );
        const raffleTicketPrice = await deployedRaffle.ticketPrice();
        const raffleBeneficiary = await deployedRaffle.beneficiary();
        const userTickets = await deployedRaffle.ticketCount(userAddress);
        const allTicketHolders = await deployedRaffle.getTicketHolders();
        const contractBalance = await provider.getBalance(raffleAddress);
        const checkOwner = await deployedRaffle.owner();
        const openStatus = await deployedRaffle.open();
        const raffle = {
          ticketPrice: ethers.utils.formatEther(raffleTicketPrice.toString()),
          beneficiary: raffleBeneficiary,
          userTicketCount: userTickets.toString(),
          totalTicketCount: allTicketHolders.length,
          balance: ethers.utils.formatEther(contractBalance.toString()),
          owner: checkOwner === userAddress,
          openStatus: openStatus,
          raffleAddress: raffleAddress,
        };
        setRafflesValue((previousRaffles) => [...previousRaffles, raffle]);
      });
    } catch (error) {
      console.log(error);
      const network = await checkNetwork();
      if (network && network !== "rinkeby") {
        console.log("Wrong Network -- Switch to Rinkeby");
      }
    }
  }, [
    checkNetwork,
    userConnected,
    provider,
    raffleFactoryAddress,
    signer,
    userAddress,
    apiConnected,
  ]);

  useEffect(() => {
    getRaffles();
  }, [userConnected, apiConnected]);

  return (
    <div>
      <RaffleTabs
        raffles={raffles}
        raffleFactoryAddress={raffleFactoryAddress}
        getRaffles={getRaffles}
        signer={signer}
        provider={provider}
        userAddress={userAddress}
        userConnected={userConnected}
      />
    </div>
  );
};

export default DeployedRaffles;
