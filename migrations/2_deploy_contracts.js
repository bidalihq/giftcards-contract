var Giftcards = artifacts.require("./Giftcards.sol");

module.exports = function(deployer) {
  deployer.deploy(Giftcards);
};
