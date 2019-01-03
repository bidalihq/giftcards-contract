# Ethereum Giftcards smart contract

[![Build Status](https://app.bitrise.io/app/f713c5bd7f2705bd/status.svg?token=U0D9ZGwVjm-vm6nZ-mezJQ&branch=master)](https://app.bitrise.io/app/f713c5bd7f2705bd)

An Ethereum smart contract for issuing, redeeming and spending gift cards. 

Methods:

```solidity
function issue(bytes32 hash, uint value)
function redeem(bytes memory code)
function spend(address by, uint amount)
function getBalance()
```