# Ethereum Giftcards smart contract

An Ethereum smart contract for issuing, redeeming and spending gift cards. Methods:

```solidity
function issue(bytes32 hash, uint value)
function redeem(bytes memory code)
function spend(address by, uint amount)
function getBalance()
```