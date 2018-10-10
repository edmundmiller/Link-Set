var MyContract = artifacts.require("./MakeRebalance.sol");
var Oracle = artifacts.require("./Oracle.sol");
var LinkToken = artifacts.require("./LinkToken.sol");

module.exports = function(deployer) {
  deployer.deploy(LinkToken).then(function() {
    deployer.deploy(Oracle, LinkToken.address).then(function() {
      deployer.deploy(MyContract, LinkToken.address, Oracle.address);
    });
  });
};
