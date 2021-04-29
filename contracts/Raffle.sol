//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.3;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Raffle is Ownable {
    uint256 public ticketCost;
    address payable public beneficiary;
    mapping(address => uint256) public ticketCount;

    constructor(uint256 _ticketCost, address payable _beneficiary) {
        console.log(
            "Deploying a raffle with ticketCost: '%s' and beneficiary: '%s'",
            _ticketCost,
            _beneficiary
        );
        ticketCost = _ticketCost;
        beneficiary = _beneficiary;
    }

    function purchaseTicket() public payable {
        require(msg.value == ticketCost, "Incorrect Ticket Price");
        ticketCount[msg.sender] += 1;
    }
}
