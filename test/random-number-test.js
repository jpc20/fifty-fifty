/* eslint-disable no-undef */
const { expect } = require("chai");

var factory;
var randNumGenerator;

beforeEach(async function () {
  accounts = await ethers.getSigners();
  factory = await ethers.getContractFactory("RandomNumberConsumer");
  randNumGenerator = await factory.deploy();
  await randNumGenerator.deployed();
});

describe("RandomNumberConsumer", function () {
  it("Should generate a random number", async function () {
    expect(await randNumGenerator.getRandomNumber(5)).to.equal(2);
  });
});
