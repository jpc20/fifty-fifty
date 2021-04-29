//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.3;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Raffle is Ownable {
  uint public ticketCost;
  address payable public beneficiary;

  constructor(uint _ticketCost, address payable _beneficiary) {
    console.log("Deploying a raffle with ticketCost: '%s' and beneficiary: '%s'", _ticketCost, _beneficiary);
    ticketCost = _ticketCost;
    beneficiary = _beneficiary;
  }

  // function setGreeting(string memory _greeting) public {
  //   console.log("Changing greeting from '%s' to '%s'", greeting, _greeting);
  //   greeting = _greeting;
  // }
}
