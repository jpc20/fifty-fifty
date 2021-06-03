//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.3;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
// import "@chainlink/contracts/src/v0.6/VRFConsumerBase.sol";

contract RaffleFactory {
    address[] public deployedRaffles;

    function createRaffle(
        bytes32 _description,
        uint256 _ticketPrice,
        address payable _beneficiary
    ) public {
        Raffle newRaffle =
            new Raffle(_description, _ticketPrice, _beneficiary, msg.sender);
        console.log("Raffle Address: '%s'", address(newRaffle));
        deployedRaffles.push(address(newRaffle));
    }

    function getDeployedRaffles() public view returns (address[] memory) {
        return deployedRaffles;
    }
}

contract Raffle is Ownable {
    uint256 public ticketPrice;
    address payable public beneficiary;
    bytes32 public description;
    mapping(address => uint256) public ticketCount;
    address[] public allTicketHolders;
    bool public open;
    Tickets public tickets;
    event TicketPurchase(address purchaser, uint256 purchaserTicketCount);
    event Distribute(address beneficiary, address winner, uint256 totalAmount);

    constructor(
        bytes32 _description,
        uint256 _ticketPrice,
        address payable _beneficiary,
        address _owner
    ) {
        console.log(
            "Deploying a raffle with ticketPrice: '%s', beneficiary: '%s', owner: '%s', and description: ",
            _ticketPrice,
            _beneficiary,
            _owner
        );
        console.logBytes32(_description);
        description = _description;
        ticketPrice = _ticketPrice;
        beneficiary = _beneficiary;
        open = true;
        tickets = new Tickets();
        transferOwnership(_owner);
    }

    function purchaseTicket() public payable {
        require(msg.value == ticketPrice, "Incorrect Ticket Price");
        allTicketHolders.push(msg.sender);
        tickets.mint(msg.sender);
        uint256 purchaserTicketCount = ticketCount[msg.sender] += 1;
        emit TicketPurchase(msg.sender, purchaserTicketCount);
    }

    function randomNum() private view returns (uint256) {
        // integrate Chainlink VRF
        return
            uint256(
                keccak256(
                    abi.encodePacked(
                        block.difficulty,
                        block.timestamp,
                        allTicketHolders
                    )
                )
            );
    }

    function pickWinner() public view onlyOwner returns (address) {
        uint256 index = randomNum() % allTicketHolders.length;
        console.log(allTicketHolders[index]);
        return allTicketHolders[index];
    }

    function distribute() public payable onlyOwner {
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

    function getTicketHolders() public view returns (address[] memory) {
        return allTicketHolders;
    }
}

contract Tickets is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC721("RaffleTicket", "TKT") {}

    function mint(address recipient) public returns (uint256) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(recipient, newItemId);
        return newItemId;
    }
}
