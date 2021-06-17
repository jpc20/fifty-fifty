//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.3;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Tickets.sol";
// import "@chainlink/contracts/src/v0.6/VRFConsumerBase.sol";

contract Raffle is Ownable {
    address payable public beneficiary;
    uint256 public ticketPrice;
    bool public open;
    Tickets public tickets;
    event TicketPurchase(address purchaser, uint256 purchaserTicketCount);
    event Distribute(address beneficiary, address winner, uint256 totalAmount);

    constructor(
        string memory _description,
        string memory _symbol,
        uint256 _ticketPrice,
        address payable _beneficiary,
        address _owner
    ) {
        ticketPrice = _ticketPrice;
        beneficiary = _beneficiary;
        open = true;
        tickets = new Tickets(_description, _symbol);
        transferOwnership(_owner);
    }

    function purchaseTicket(string memory _tokenURI) public payable {
        require(msg.value == ticketPrice, "Incorrect Ticket Price");
        tickets.mint(msg.sender, _tokenURI);
        emit TicketPurchase(msg.sender, tickets.balanceOf(msg.sender));
    }

    function randomNum() private view returns (uint256) {
        // integrate Chainlink VRF
        return
            uint256(
                keccak256(
                    abi.encodePacked(
                        block.difficulty,
                        block.timestamp,
                        tickets.totalSupply()
                    )
                )
            );
    }

    function pickWinner() public view onlyOwner returns (address) {
        uint256 index = randomNum() % tickets.totalSupply();
        uint256 winningTicket = tickets.tokenByIndex(index);
        return tickets.ownerOf(winningTicket);
    }

    function distribute() public payable onlyOwner {
        require(tickets.totalSupply() > 0, "No tickets have been sold");
        address winner = pickWinner();
        uint256 totalAmount = address(this).balance;
        (bool sentToBene, bytes memory beneData) =
            beneficiary.call{value: totalAmount / 2}("");
        (bool sentToWinner, bytes memory winnerData) =
            winner.call{value: address(this).balance}("");
        require(sentToBene, "Failed to send Ether to Beneficiary");
        require(sentToWinner, "Failed to send Ether to Winner");
        open = false;
        emit Distribute(beneficiary, winner, totalAmount);
    }
}
