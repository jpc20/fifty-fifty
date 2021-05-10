import Raffle from "./Raffle";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import RaffleFactory from "../../artifacts/contracts/Raffle.sol/RaffleFactory.json";

const DeployedRaffles = ({
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
  }, [getSignerAndProvider, raffleFactoryAddress, raffles]);

  const raffleComponents = raffles.map((raffleAddress) => {
    return (
      <Raffle
        raffleAddress={raffleAddress}
        key={raffleAddress}
        getSignerAndProvider={getSignerAndProvider}
      />
    );
  });
  return (
    <div>
      {raffleComponents.length > 0 ? raffleComponents : "No Raffles"}
    </div>
  );
};

export default DeployedRaffles;
