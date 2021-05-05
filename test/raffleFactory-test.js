const Raffle = require("../src/artifacts/contracts/Raffle.sol/Raffle.json");
const { expect } = require("chai");

describe("RaffleFactory", function () {
  it("Should deploy a raffle with an owner, ticket price, and beneficiary", async function () {
    accounts = await ethers.getSigners();
    RaffleFactory = await ethers.getContractFactory("RaffleFactory");
    factory = await RaffleFactory.deploy();
    await factory.deployed();
    ticketPrice = ethers.utils.parseEther(".1");
    await factory.createRaffle(ticketPrice, accounts[1].address);
    const raffles = await factory.getDeployedRaffles();
    const raffle = new ethers.Contract(
      raffles[0],
      Raffle.abi,
      accounts[0]
    );;
    expect(await raffle.owner()).to.equal(accounts[0].address);
    expect(await raffle.beneficiary()).to.equal(accounts[1].address);
    expect(await raffle.ticketPrice()).to.equal(ticketPrice);
  });
});
