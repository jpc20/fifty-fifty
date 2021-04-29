const { expect } = require("chai");

describe("Raffle", function () {
  it("Should deploy a raffle with an owner, ticket cost, and beneficiary", async function () {
    const accounts = await ethers.getSigners();
    const Raffle = await ethers.getContractFactory("Raffle");
    const raffle = await Raffle.deploy(100, accounts[1].address);
    await raffle.deployed();

    expect(await raffle.owner()).to.equal(accounts[0].address);
    expect(await raffle.beneficiary()).to.equal(accounts[1].address);
    expect(await raffle.ticketCost()).to.equal(100);
  });

  it("Allows an account to purchase a ticket", async function () {
    const accounts = await ethers.getSigners();
    const Raffle = await ethers.getContractFactory("Raffle");
    const raffle = await Raffle.deploy(100, accounts[1].address);
    await raffle.deployed();

    expect(await raffle.ticketCount(accounts[2].address)).to.equal(0);
    await raffle
      .connect(accounts[2])
      .purchaseTicket({ from: accounts[2].address, value: 100 });
    expect(await raffle.ticketCount(accounts[2].address)).to.equal(1);
    expect(await ethers.provider.getBalance(raffle.address)).to.equal(100);
  });

  it("Requires the exact ticket price", async function () {
    const accounts = await ethers.getSigners();
    const Raffle = await ethers.getContractFactory("Raffle");
    const raffle = await Raffle.deploy(100, accounts[1].address);
    await raffle.deployed();
    await expect(
      raffle
        .connect(accounts[2])
        .purchaseTicket({ from: accounts[2].address, value: 10 })
    ).to.be.revertedWith("Incorrect Ticket Price");
  });

  it("Allows the owner to distribute funds", async function () {
    const accounts = await ethers.getSigners();
    const Raffle = await ethers.getContractFactory("Raffle");
    const raffle = await Raffle.deploy(100, accounts[1].address);
    const beneficiaryBalance = await ethers.provider.getBalance(
      accounts[1].address
    );
    const winnerBalance = await ethers.provider.getBalance(accounts[2].address);
    await raffle.deployed();
    await raffle
      .connect(accounts[2])
      .purchaseTicket({ from: accounts[2].address, value: 100 });

    const raffleBalance = await ethers.provider.getBalance(raffle.address);
    await raffle.connect(accounts[0]).distribute();
    expect(await ethers.provider.getBalance(raffle.address)).to.equal(0);
    // Need to figure out big numbers to implement

    // expect(
    //   await ethers.provider.getBalance(accounts[1].address) -
    //     beneficiaryBalance
    // ).to.equal(raffleBalance / 2);
    // expect(await ethers.provider.getBalance(accounts[2].address)).to.equal(
    //   winnerBalance + (raffleBalance / 2)
    // );
  });
});
