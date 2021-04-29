const { expect } = require("chai");

describe("Raffle", function() {
  it("Should deploy a raffle with an owner, ticket cost, and beneficiary", async function() {
    const accounts = await ethers.getSigners();
    const Raffle = await ethers.getContractFactory("Raffle");
    const raffle = await Raffle.deploy(100, accounts[1].address);
    await raffle.deployed();

    expect(await raffle.owner()).to.equal(accounts[0].address);
    expect(await raffle.beneficiary()).to.equal(accounts[1].address);
    expect(await raffle.ticketCost()).to.equal(100);
  });
});
