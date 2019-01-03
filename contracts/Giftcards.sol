pragma solidity ^0.5.0;

contract Giftcards {
	address public owner;

	struct Giftcard {
		address owner;
		uint value;
	}

	mapping (address => uint) balances;
	mapping (bytes32 => Giftcard) giftcards;

	event Redeemed(address indexed _by, bytes32 _hash);
	event Spent(address indexed _by, uint _amount);

	constructor() public {
		owner = msg.sender;
	}

	function issue(bytes32 hash, uint value) public {
		require(msg.sender == owner, "Only the owner can issue new giftcards");
		require(value > 0, "Giftcard must have a balance");
		require(giftcards[hash].value == 0, "Giftcard already issued");

		giftcards[hash] = Giftcard({
			value: value,
			owner: address(0) // No owner
		});
	}

	function redeem(bytes memory code) public {
		bytes32 hash = keccak256(code);
		Giftcard memory giftcard = giftcards[hash];

		require(giftcard.value > 0, "Invalid giftcard code");
		require(giftcard.owner == address(0), "Giftcard already redeemed");

		giftcards[hash].owner = msg.sender;
		balances[msg.sender] += giftcard.value;

		emit Redeemed(msg.sender, hash);
	}

	function spend(address by, uint amount) public {
		require(msg.sender == owner, "Only the owner can deduct from balance");

		uint balance = balances[by];

		require(balance >= amount, 'Insufficient funds');

		balances[by] -= amount;

		emit Spent(by, amount);
	}

	function getBalance() public view returns (uint _balance) {
		_balance = balances[msg.sender];
	}
}
