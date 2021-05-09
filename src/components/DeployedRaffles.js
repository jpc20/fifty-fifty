import Raffle from "./Raffle";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import RaffleFactory from "../artifacts/contracts/Raffle.sol/RaffleFactory.json";

const DeployedRaffles = ({
  userAddress,
  getSignerAndProvider,
  raffleFactoryAddress,
}) => {
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
  }, [raffles]);

  const raffleComponents = raffles.map((raffleAddress) => {
    return (
      <Raffle
        raffleAddress={raffleAddress}
        key={raffleAddress}
        userAddress={userAddress}
        getSignerAndProvider={getSignerAndProvider}
      />
    );
  });
  return <div>{raffleComponents}</div>;
};

export default DeployedRaffles;
