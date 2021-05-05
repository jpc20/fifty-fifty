import "./App.css";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import RaffleFactory from "./artifacts/contracts/Raffle.sol/RaffleFactory.json";
import Raffle from "./artifacts/contracts/Raffle.sol/Raffle.json";

const raffleFactoryAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // local
// const greeterAddress = "0xeee7874BaF2BFEB1df7E09D55A56594A50ACFae2"; // ropsten

function App() {
  const [ticketPrice, setTicketPriceValue] = useState(0.01);
  const [beneficiary, setBeneficiaryValue] = useState("");

  async function requestAccount() {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }

  useEffect(async () => {
    await requestAccount();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const address  = await signer.getAddress()
    setBeneficiaryValue(address);
  });

  // async function fetchGreeting() {
  //   if (typeof window.ethereum !== "undefined") {
  //     const provider = new ethers.providers.Web3Provider(window.ethereum);
  //     console.log({ provider });
  //     const contract = new ethers.Contract(
  //       greeterAddress,
  //       Greeter.abi,
  //       provider
  //     );
  //     try {
  //       const data = await contract.greet();
  //       console.log("data: ", data);
  //     } catch (err) {
  //       console.log("Error: ", err);
  //     }
  //   }
  // }

  // async function setGreeting() {
  //   if (!greeting) return;
  //   if (typeof window.ethereum !== "undefined") {
  //     await requestAccount();
  //     const provider = new ethers.providers.Web3Provider(window.ethereum);
  //     console.log({ provider });
  //     const signer = provider.getSigner();
  //     const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer);
  //     const transaction = await contract.setGreeting(greeting);
  //     setGreetingValue('')
  //     await transaction.wait();
  //     fetchGreeting();
  //   }
  // }

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
      await factory.createRaffle(formattedPrice, beneficiary);
      try {
        const raffles = await factory.getDeployedRaffles();
        console.log("raffles: ", raffles);
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
      </header>
    </div>
  );
}

export default App;
