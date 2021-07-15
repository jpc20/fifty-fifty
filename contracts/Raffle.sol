//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.6;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./Tickets.sol";

contract Raffle is Ownable {
    address payable public beneficiary;
    uint256 public ticketPrice;
    bool public open;
    Tickets public tickets;
    address public admin;
    event TicketPurchase(
        address purchaser,
        uint256 purchaserTicketCount,
        uint256 newTicketID
    );
    event Distribute(address beneficiary, address winner, uint256 totalAmount);

    constructor(
        string memory _description,
        string memory _symbol,
        uint256 _ticketPrice,
        address payable _beneficiary,
        address _owner
    ) {
        require(_ticketPrice > 0);
        ticketPrice = _ticketPrice;
        beneficiary = _beneficiary;
        open = true;
        tickets = new Tickets(_description, _symbol);
        admin = msg.sender;
        transferOwnership(_owner);
    }

    function purchaseTicket() public payable {
        require(msg.value == ticketPrice, "Wrong Price");
        uint256 newTicketID = tickets.mint(msg.sender);
        emit TicketPurchase(
            msg.sender,
            tickets.balanceOf(msg.sender),
            newTicketID
        );
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

    function pickWinner() private view returns (address) {
        uint256 index = randomNum() % tickets.totalSupply();
        uint256 winningTicket = tickets.tokenByIndex(index);
        return tickets.ownerOf(winningTicket);
    }

    function distribute() public onlyOwner {
        require(tickets.totalSupply() > 0, "No tickets sold");
        require(msg.sender == owner());
        address winner = pickWinner();
        require(tickets.balanceOf(winner) >= 1);
        open = false;
        uint256 totalAmount = address(this).balance;
        (bool sentToBene, ) = beneficiary.call{
            value: address(this).balance / 2
        }("");
        (bool sentToWinner, ) = winner.call{value: address(this).balance}("");
        require(sentToBene && sentToWinner);
        emit Distribute(beneficiary, winner, totalAmount);
    }

    function close() external {
        require(msg.sender == admin);
        if (tickets.totalSupply() > 0) {
            distribute();
        } else {
            open = false;
        }
    }
}
