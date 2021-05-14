import { useState, useEffect } from "react";
import { ethers } from "ethers";
import RaffleFactory from "../../artifacts/contracts/Raffle.sol/RaffleFactory.json";
import RaffleTabs from "./RaffleTabs";

const DeployedRaffles = ({
  getSignerAndProvider,
  raffleFactoryAddress,
  checkNetwork,}) => {
  const [raffles, setRafflesValue] = useState([]);

  useEffect(() => {
    const getRaffles = async () => {
      try {
        const [provider, signer, address] = await getSignerAndProvider();
        const factory = new ethers.Contract(
          raffleFactoryAddress,
          RaffleFactory.abi,
          signer
        );
        const raffles = await factory.getDeployedRaffles();
        setRafflesValue([...raffles]);
      } catch (error) {
        const network = await checkNetwork();
        if (network && network !== 'rinkeby') {
          console.log('Wrong Network -- Switch to Rinkeby')
        };
      }
    };
    getRaffles();
  }, [getSignerAndProvider, raffleFactoryAddress]);

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
