/* eslint-disable no-undef */
const Tickets = require("../src/artifacts/contracts/Raffle.sol/Tickets.json");
const { expect } = require("chai");

var accounts;
var Raffle;
var TicketAddress;
var tickets;
var raffle;
var ticketPrice;
var description;

beforeEach(async function () {
  accounts = await ethers.getSigners();
  Raffle = await ethers.getContractFactory("Raffle");
  ticketPrice = ethers.utils.parseEther(".1");
  description = ethers.utils.formatBytes32String("test description");
  raffle = await Raffle.deploy(
    description,
    ticketPrice,
    accounts[1].address,
    accounts[0].address
  );
  await raffle.deployed();
  TicketAddress = await raffle.tickets()
  tickets = new ethers.Contract(
      TicketAddress,
      Tickets.abi,
      accounts[0],
  )
});

describe("Ticket", function () {
  it("Mints a ticket to the account that calls the purchase function", async function () {
    await raffle
      .connect(accounts[2])
      .purchaseTicket({ from: accounts[2].address, value: ticketPrice });
    await raffle
      .connect(accounts[2])
      .purchaseTicket({ from: accounts[2].address, value: ticketPrice });
      const acct1TicketCount = await tickets.balanceOf(accounts[1].address);
      expect(acct1TicketCount.toString()).to.equal("0")
      const acct2TicketCount = await tickets.balanceOf(accounts[2].address);
      expect(acct2TicketCount.toString()).to.equal("2")
      expect(await tickets.ownerOf('1')).to.equal(accounts[2].address)
  });
});