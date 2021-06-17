import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import RaffleFactory from "../../artifacts/contracts/RaffleFactory.sol/RaffleFactory.json";
import RaffleTabs from "./RaffleTabs";
import RaffleContract from "../../artifacts/contracts/Raffle.sol/Raffle.json";
import Tickets from "../../artifacts/contracts/Tickets.sol/Tickets.json";

const DeployedRaffles = ({
  raffleFactoryAddress,
  signer,
  provider,
  userAddress,
  userConnected,
  apiConnected,
  setFlashActive,
  setFlashMessage,
  setFlashType,
}) => {
  const [raffles, setRafflesValue] = useState([]);

  const getRaffles = useCallback(async () => {
    try {
      const factory = new ethers.Contract(
        raffleFactoryAddress,
        RaffleFactory.abi,
        signer
      );
      const rafflesAddresses = await factory.getDeployedRaffles();
      const raffleResp = await Promise.all(
        rafflesAddresses.map(async (raffleAddress) => {
          const deployedRaffle = new ethers.Contract(
            raffleAddress,
            RaffleContract.abi,
            signer
          );
          const raffleTicketPrice = await deployedRaffle.ticketPrice();
          const raffleBeneficiary = await deployedRaffle.beneficiary();
          const contractBalance = await provider.getBalance(raffleAddress);
          const checkOwner = await deployedRaffle.owner();
          const openStatus = await deployedRaffle.open();
          const ticketsAddress = await deployedRaffle.tickets();
          const tickets = new ethers.Contract(
            ticketsAddress,
            Tickets.abi,
            signer
          );
          const userTickets = await tickets.balanceOf(userAddress);
          const ticketSupply = await tickets.totalSupply();
          const description = await tickets.name();
          return {
            ticketPrice: ethers.utils.formatEther(raffleTicketPrice.toString()),
            beneficiary: raffleBeneficiary,
            userTicketCount: userTickets.toString(),
            totalTicketCount: ticketSupply.toString(),
            balance: ethers.utils.formatEther(contractBalance.toString()),
            owner: checkOwner === userAddress,
            openStatus: openStatus,
            raffleAddress: raffleAddress,
            description: description,
          };
        })
      );
      setRafflesValue(raffleResp);
    } catch (error) {
      console.log(error);
    }
  }, [raffleFactoryAddress, signer, provider, userAddress]);

  useEffect(() => {
    if (userConnected === false && apiConnected === false) return;
    getRaffles();
  }, [getRaffles, userConnected, apiConnected]);

  return (
    <>
      <RaffleTabs
        raffles={raffles}
        raffleFactoryAddress={raffleFactoryAddress}
        getRaffles={getRaffles}
        signer={signer}
        provider={provider}
        userAddress={userAddress}
        userConnected={userConnected}
        setFlashActive={setFlashActive}
        setFlashMessage={setFlashMessage}
        setFlashType={setFlashType}
      />
    </>
  );
};

export default DeployedRaffles;
