/* eslint-disable no-undef */
const Raffle = require("../../src/artifacts/contracts/Raffle.sol/Raffle.json");
const { expect } = require("chai");

describe("RaffleFactory", function () {
  it("Should deploy a raffle with an owner, ticket price, and beneficiary", async function () {
    const accounts = await ethers.getSigners();
    const RaffleFactory = await ethers.getContractFactory("RaffleFactory");
    const factory = await RaffleFactory.deploy();
    await factory.deployed();
    const ticketPrice = ethers.utils.parseEther(".1");
    const description = "test description";
    const symbol = "TEST_TKT";
    await factory.createRaffle(
      description,
      symbol,
      ticketPrice,
      accounts[1].address
    );
    const raffles = await factory.getDeployedRaffles();
    const raffle = new ethers.Contract(raffles[0], Raffle.abi, accounts[0]);
    expect(await raffle.owner()).to.equal(accounts[0].address);
    expect(await raffle.beneficiary()).to.equal(accounts[1].address);
    expect(await raffle.ticketPrice()).to.equal(ticketPrice);
  });

  it("Admin can close a raffle", async function () {
    const accounts = await ethers.getSigners();
    const RaffleFactory = await ethers.getContractFactory("RaffleFactory");
    const factory = await RaffleFactory.deploy();
    await factory.deployed();
    const ticketPrice = ethers.utils.parseEther(".1");
    const description = "test description";
    const symbol = "TEST_TKT";
    await factory
      .connect(accounts[1])
      .createRaffle(description, symbol, ticketPrice, accounts[1].address);
    const raffles = await factory.getDeployedRaffles();
    const raffle = new ethers.Contract(raffles[0], Raffle.abi, accounts[2]);
    expect(await factory.admin()).to.equal(accounts[0].address);
    expect(await raffle.owner()).to.equal(accounts[1].address);
    await raffle
      .connect(accounts[3])
      .purchaseTicket({ from: accounts[3].address, value: ticketPrice });
    expect(await raffle.open()).to.equal(true);
    await factory.connect(accounts[0]).closeRaffle(raffle.address);
    expect(await raffle.open()).to.equal(false);
  });
});
