//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.3;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Raffle is Ownable {
    uint256 public ticketCost;
    address payable public beneficiary;
    mapping(address => uint256) public ticketCount;
    address[] public allTicketHolders;

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
        if (ticketCount[msg.sender] == 0) {
            allTicketHolders.push(msg.sender);
        }
        ticketCount[msg.sender] += 1;
    }

    function distribute() public payable onlyOwner {
        (bool sentToBene, bytes memory beneData) =
            beneficiary.call{value: address(this).balance / 2}("");
            // set up function to pick a random winner
        (bool sentToWinner, bytes memory winnerData) =
            allTicketHolders[0].call{value: address(this).balance}("");
        require(sentToBene, "Failed to send Ether to Beneficiary");
        require(sentToWinner, "Failed to send Ether to Winner");
    }
}
