var Migrations = artifacts.require("./Migrations.sol");

module.exports = function(deployer, network) {
  if (network == "test" || network == "development") {
    deployer.deploy(Migrations);
  }
};
