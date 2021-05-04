//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.3;
// pragma solidity ^0.8.3 || >=0.6.0;
// pragma solidity >=0.6.0 <9.0.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
// import "@chainlink/contracts/src/v0.6/VRFConsumerBase.sol";

contract RaffleFactory {
    address[] public deployedRaffles;

    function createRaffle(uint _ticketPrice, address payable _beneficiary) public {
        Raffle newRaffle = new Raffle(_ticketPrice, _beneficiary, msg.sender);
        deployedRaffles.push(address(newRaffle));
    }

    function getDeployedRaffles() public view returns(address[] memory) {
        return deployedRaffles;
    }
}

contract Raffle is Ownable {
    uint256 public ticketPrice;
    address payable public beneficiary;
    mapping(address => uint256) public ticketCount;
    address[] public allTicketHolders;

    constructor(uint256 _ticketPrice, address payable _beneficiary, address _owner) {
        console.log(
            "Deploying a raffle with ticketPrice: '%s', beneficiary: '%s', and owner: '%s'",
            _ticketPrice,
            _beneficiary,
            _owner
        );
        ticketPrice = _ticketPrice;
        beneficiary = _beneficiary;
        transferOwnership(_owner);
    }

    function purchaseTicket() public payable {
        require(msg.value == ticketPrice, "Incorrect Ticket Price");
        allTicketHolders.push(msg.sender);
        ticketCount[msg.sender] += 1;
    }

    function randomNum() private view returns(uint) {
        // integrate Chainlink VRF
       return uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, allTicketHolders)));
    }

    function pickWinner() public view onlyOwner returns(address) {
        uint index = randomNum() % allTicketHolders.length;
        console.log(allTicketHolders[index]);
        return allTicketHolders[index];
    }

    function distribute() public payable onlyOwner {
        (bool sentToBene, bytes memory beneData) =
            beneficiary.call{value: address(this).balance / 2}("");
        (bool sentToWinner, bytes memory winnerData) =
            pickWinner().call{value: address(this).balance}("");
        require(sentToBene, "Failed to send Ether to Beneficiary");
        require(sentToWinner, "Failed to send Ether to Winner");
    }
}
