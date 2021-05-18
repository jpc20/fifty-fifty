import { useState, useEffect } from "react";
import { ethers } from "ethers";
import RaffleFactory from "../../artifacts/contracts/Raffle.sol/RaffleFactory.json";
import RaffleTabs from "./RaffleTabs";
import RaffleContract from "../../artifacts/contracts/Raffle.sol/Raffle.json";

const DeployedRaffles = ({
  getSignerAndProvider,
  raffleFactoryAddress,
  checkNetwork,}) => {
  const [raffles, setRafflesValue] = useState([]);

  const getRaffles = async () => {
    try {
      const [provider, signer, address] = await getSignerAndProvider();
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
        const userTickets = await deployedRaffle.ticketCount(address);
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
          owner: checkOwner === address,
          openStatus: openStatus,
          raffleAddress: raffleAddress,
        };
        setRafflesValue(raffs => [...raffs, raffle])
      });
    } catch (error) {
      const network = await checkNetwork();
      if (network && network !== 'rinkeby') {
        console.log('Wrong Network -- Switch to Rinkeby')
      };
    }
  };
  useEffect(() => {
    getRaffles();
  }, []);

  return (
    <div>
        <RaffleTabs
          raffles={raffles}
          getSignerAndProvider={getSignerAndProvider}
          raffleFactoryAddress={raffleFactoryAddress}
        />
    </div>
  );
};

export default DeployedRaffles;
