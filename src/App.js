import "./App.css";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import RaffleFactory from "./artifacts/contracts/Raffle.sol/RaffleFactory.json";
import DeployedRaffles from "./components/DeployedRaffles";

const raffleFactoryAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // local
// const raffleFactoryAddress = "0xeee7874BaF2BFEB1df7E09D55A56594A50ACFae2"; // ropsten

function App() {
  const [ticketPrice, setTicketPriceValue] = useState(0.01);
  const [beneficiary, setBeneficiaryValue] = useState("");
  const [raffles, setRafflesValue] = useState([]);

  async function requestAccount() {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }

  useEffect(async () => {
    await requestAccount();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    setBeneficiaryValue(address);
    const factory = new ethers.Contract(
      raffleFactoryAddress,
      RaffleFactory.abi,
      signer
    );
    const allRaffles = await factory.getDeployedRaffles();
    setRafflesValue([...allRaffles]);
  }, []);

  async function deployRaffle() {
    if (!ticketPrice || !beneficiary) return;
    if (typeof window.ethereum !== "undefined") {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const factory = new ethers.Contract(
        raffleFactoryAddress,
        RaffleFactory.abi,
        signer
      );
      const formattedPrice = ethers.utils.parseEther(ticketPrice.toString());
      try {
        await factory.createRaffle(formattedPrice, beneficiary);
      } catch (err) {
        console.log("Error: ", err);
      }
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={deployRaffle}>Deploy Raffle</button>
        <input
          onChange={(e) => setTicketPriceValue(e.target.value)}
          placeholder="Set ticket price"
          value={ticketPrice}
        />
        <input
          onChange={(e) => setBeneficiaryValue(e.target.value)}
          placeholder="Beneficiary"
          value={beneficiary}
        />
        <DeployedRaffles raffles={raffles} ticketPrice={ticketPrice} />
      </header>
    </div>
  );
}

export default App;
