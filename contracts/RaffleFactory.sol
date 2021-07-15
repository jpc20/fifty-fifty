//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.6;

import "./Raffle.sol";

contract RaffleFactory {
    address[] public deployedRaffles;
    address public admin;

    constructor() {
        admin = msg.sender;
    }

    function createRaffle(
        string memory _description,
        string memory _symbol,
        uint256 _ticketPrice,
        address payable _beneficiary
    ) public {
        Raffle newRaffle = new Raffle(
            _description,
            _symbol,
            _ticketPrice,
            _beneficiary,
            msg.sender
        );
        deployedRaffles.push(address(newRaffle));
    }

    function getDeployedRaffles() public view returns (address[] memory) {
        return deployedRaffles;
    }

    function closeRaffle(address _raffle) public {
        require(msg.sender == admin);
        Raffle(_raffle).close();
    }
}
