import * as Web3 from "web3";

const injectedWeb3 = window.web3 || undefined;
let provider;
try {
  // Use MetaMask/Mist provider
  provider = injectedWeb3.currentProvider;
} catch (err) {
  // Throws when user doesn't have MetaMask/Mist running
  throw new Error(
    `No injected web3 found when initializing setProtocol: ${err}`
  );
}

const config = {
  coreAddress: "0x9797d7c3d8d32c01c27476a36c032b7fe32c5b59",
  setTokenFactoryAddress: "0x0b24de0bca3e20c53abf4c0f87e24be52324d3a0",
  transferProxyAddress: "0x595f8dab94b9c718cbf5c693cd539fd00b286d3d",
  vaultAddress: "0x6099e87a16fefe9d778059eeb6d85719fe8a9283",
  rebalancingSetTokenFactoryAddress:
    "0x422405fc53e60cd679531330cea7b0952f929e44"
};
