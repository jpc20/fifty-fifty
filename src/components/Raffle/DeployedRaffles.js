import Raffle from "./Raffle";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import RaffleFactory from "../../artifacts/contracts/Raffle.sol/RaffleFactory.json";
import RaffleTabs from "./RaffleTabs";

const DeployedRaffles = ({
  getSignerAndProvider,
  raffleFactoryAddress}) => {
  const [raffles, setRafflesValue] = useState([]);

  useEffect(() => {
    const getRaffles = async () => {
      const [provider, signer, address] = await getSignerAndProvider();
      const factory = new ethers.Contract(
        raffleFactoryAddress,
        RaffleFactory.abi,
        signer
      );
      const raffles = await factory.getDeployedRaffles();
      setRafflesValue([...raffles]);
    };
    getRaffles();
  }, [getSignerAndProvider, raffleFactoryAddress, raffles]);

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
