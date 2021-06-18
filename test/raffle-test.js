/* eslint-disable no-undef */
const { expect } = require("chai");
const Tickets = require("../src/artifacts/contracts/Tickets.sol/Tickets.json");

var description;
var accounts;
var Raffle;
var raffle;
var ticketPrice;
var symbol;
var TicketAddress;
var tickets;
var metadata;

beforeEach(async function () {
  accounts = await ethers.getSigners();
  Raffle = await ethers.getContractFactory("Raffle");
  ticketPrice = ethers.utils.parseEther(".1");
  description = "test description";
  symbol = "TEST-TKT";
  metadata = {
    name: "Buzz",
    description:
      "Paper collage, using salvaged and original watercolour papers",
    image:
      "https://ipfs.infura.io/ipfs/QmWc6YHE815F8kExchG9kd2uSsv7ZF1iQNn23bt5iKC6K3/image",
  };
  raffle = await Raffle.deploy(
    description,
    symbol,
    ticketPrice,
    accounts[1].address,
    accounts[0].address
  );
  await raffle.deployed();
  TicketAddress = await raffle.tickets();
  tickets = new ethers.Contract(TicketAddress, Tickets.abi, accounts[0]);
});

describe("Raffle", function () {
  it("Should deploy a raffle with a description, owner, ticket price, and beneficiary", async function () {
    expect(await raffle.owner()).to.equal(accounts[0].address);
    expect(await raffle.beneficiary()).to.equal(accounts[1].address);
    expect(await raffle.ticketPrice()).to.equal(ticketPrice);
    expect(await raffle.open()).to.equal(true);
  });

  it("Allows an account to purchase a ticket", async function () {
    expect(await tickets.balanceOf(accounts[2].address)).to.equal(0);
    await raffle
      .connect(accounts[2])
      .purchaseTicket(metadata, { from: accounts[2].address, value: ticketPrice });
    expect(await tickets.balanceOf(accounts[2].address)).to.equal(1);
    expect(await ethers.provider.getBalance(raffle.address)).to.equal(
      ticketPrice
    );
  });

  it("Requires the exact ticket price", async function () {
    await expect(
      raffle
        .connect(accounts[2])
        .purchaseTicket(metadata, { from: accounts[2].address, value: 100 })
    ).to.be.revertedWith("Incorrect Ticket Price");
  });

  it("Emits an event after a successful purchase", async function () {
    await expect(
      raffle
        .connect(accounts[2])
        .purchaseTicket(metadata, { from: accounts[2].address, value: ticketPrice })
    )
      .to.emit(raffle, "TicketPurchase")
      .withArgs(accounts[2].address, 1, 1);
  });

  it("Allows the owner to distribute funds", async function () {
    const beneficiaryBalance = await ethers.provider.getBalance(
      accounts[1].address
    );
    await expect(raffle.connect(accounts[0]).distribute()).to.be.revertedWith(
      "No tickets have been sold"
    );
    await raffle
      .connect(accounts[2])
      .purchaseTicket(metadata, { from: accounts[2].address, value: ticketPrice });
    const winnerBalance = await ethers.provider.getBalance(accounts[2].address);
    await raffle.connect(accounts[0]).distribute();

    expect(await ethers.provider.getBalance(raffle.address)).to.equal(0);
    const newBeneBal = await ethers.provider.getBalance(accounts[1].address);
    const beneficiaryBalanceEth = await ethers.utils.formatEther(
      beneficiaryBalance
    );
    const newBeneficiaryBalanceEth = await ethers.utils.formatEther(newBeneBal);
    expect(
      Math.round((newBeneficiaryBalanceEth - beneficiaryBalanceEth) * 100) / 100
    ).to.equal(0.05);

    const winnerBalanceEth = await ethers.utils.formatEther(winnerBalance);
    const newWinnerBalance = await ethers.provider.getBalance(
      accounts[2].address
    );
    const newWinnerBalanceEth = await ethers.utils.formatEther(
      newWinnerBalance
    );
    expect(
      Math.round((newWinnerBalanceEth - winnerBalanceEth) * 100) / 100
    ).to.equal(0.05);
  });

  it("Emits an event when and closes the raffle funds are distributed", async function () {
    await raffle
      .connect(accounts[2])
      .purchaseTicket(metadata, { from: accounts[2].address, value: ticketPrice });
    expect(await raffle.connect(accounts[0]).distribute())
      .to.emit(raffle, "Distribute")
      .withArgs(accounts[1].address, accounts[2].address, ticketPrice);
    expect(await raffle.open()).to.equal(false);
  });
});
