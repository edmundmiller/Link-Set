import React, { Component } from "react";
import "./App.css";

import SetProtocol from "setprotocol.js";
import BigNumber from "bignumber.js";

// abi
const abi = require("./abi");

// Metamask configuration
const userMetamaskAddress = "0xafd860a9ac1e1f29e1efa102f82081cd38626054";
const trueUsdAddress = "0xc269e9396556b6afb0c38eef4a590321ff9e8d3a";
const daiAddress = "0xeadada7c6943c223c0d4bea475a6dacc7368f8d6";
const chainLinkContractAddress = "0x94ea520513baf37e93dbdf917171b7c48925d03c";

// Ropsten configuration
const config = {
  coreAddress: "0x3f8090abf98185b9d611293903255e169c6ba18f",
  setTokenFactoryAddress: "0xe60e6d5f6bc54bef4b2e3a6c7744bbdd318143a6",
  transferProxyAddress: "0xabe13798b5db637b044cbfdb24534d1d43608994",
  vaultAddress: "0x257bc17db4bb4188ef137266ddcdd2fe03b47640",
  rebalancingSetTokenFactoryAddress:
    "0x10c0f51a6c94f36c31c30a379deea503564e1355"
};

// Local configuration
const localConfig = {
  coreAddress: "0x3f8090abf98185b9d611293903255e169c6ba18f",
  setTokenFactoryAddress: "0xe60e6d5f6bc54bef4b2e3a6c7744bbdd318143a6",
  transferProxyAddress: "0xabe13798b5db637b044cbfdb24534d1d43608994",
  vaultAddress: "0x257bc17db4bb4188ef137266ddcdd2fe03b47640",
  rebalancingSetTokenFactoryAddress:
    "0x10c0f51a6c94f36c31c30a379deea503564e1355"
};

const ropstenConfig = {};

class App extends Component {
  constructor() {
    super();
    const injectedWeb3 = window.web3 || undefined;
    let setProtocol;
    try {
      // Use MetaMask/Mist provider
      const provider = injectedWeb3.currentProvider;
      setProtocol = new SetProtocol(provider, config);
      console.log("SET PROTOCOL:", setProtocol);
    } catch (err) {
      // Throws when user doesn't have MetaMask/Mist running
      throw new Error(
        `No injected web3 found when initializing setProtocol: ${err}`
      );
    }

    this.state = {
      setProtocol,
      web3: injectedWeb3,
      // Etherscan Links
      createdSetLink: `https://ropsten.etherscan.io/address/0x8aaa5febbf42a56662a02ecd494cd4ddd7d76952`,
      daiBalance: "",
      trueUsdBalance: "",
      setAddress: "0xbf9d40028fbd26df9d20563ff4313df9de4fb55d",
      set2Address: "0xe233103865481c4e8bb1a81d2fbf25a95fb0b39b",
      createdSet2Link: `https://ropsten.etherscan.io/address/0x1844704337610fec9302cdbf88784de0b16681d8`,
      tokensToApprove: [],
      setDaiBalance: "",
      setTrueUsdBalance: "",
      rebalancingSetAddress: "0xe5de4d9e9b7ad0c990c4d55dbf47628a739a5252",
      rebalancedSet1Balance: "",
      rebalanceProposalTXHash: ""
    };
    this.createSet = this.createSet.bind(this);
    this.createSet2 = this.createSet2.bind(this);
    this.getAccount = this.getAccount.bind(this);
    this.approveTokensForTransfer = this.approveTokensForTransfer.bind(this);
    this.issueStableSet = this.issueStableSet.bind(this);
    this.issueRebalancedSet = this.issueRebalancedSet.bind(this);
    this.createDynamicDEXSet = this.createDynamicDEXSet.bind(this);
    this.proposeRebalance = this.proposeRebalance.bind(this);
    this.redeemRebalance = this.redeemRebalance.bind(this);
    this.getBidPrice = this.getBidPrice.bind(this);
    this.rebalance = this.rebalance.bind(this);
    this.bidOnRebalance = this.bidOnRebalance.bind(this);
  }

  async componentDidMount() {
    await this.getMyTokenBalances();
    await this.getMySetTokenBalances();
    await this.getInitialSetTokenBalances();
    await this.getRebalancedSetTokenBalances();
  }

  async createSet() {
    const { setProtocol } = this.state;

    /**
     * Steps to create your own Set Token
     * ----------------------------------
     *
     * 1. Fund your MetaMask wallet with Kovan ETH: https://gitter.im/kovan-testnet/faucet
     * 2. Modify your Set details below to your liking
     * 3. Click `Create My Set`
     */

    const componentAddresses = [trueUsdAddress, daiAddress];
    const componentUnits = [new BigNumber(1), new BigNumber(1)];
    const naturalUnit = new BigNumber(10);
    const name = "My Set";
    const symbol = "MS";
    const account = this.getAccount();
    const txOpts = {
      from: account,
      gas: 4000000,
      gasPrice: 8000000000
    };

    const details = await setProtocol.calculateSetUnitsAsync(
      componentAddresses,
      componentUnits,
      [new BigNumber(0.5), new BigNumber(0.5)],
      new BigNumber(10)
      // percentError
    );

    const txHash = await setProtocol.createSetAsync(
      componentAddresses,
      details.units,
      details.naturalUnit,
      name,
      symbol,
      txOpts
    );

    const setAddress = await setProtocol.getSetAddressFromCreateTxHashAsync(
      txHash
    );

    console.log("Tokens To Approve", componentAddresses);
    console.log("ADDRESS: ", setAddress);
    this.setState({
      createdSetLink: `https://ropsten.etherscan.io/address/${setAddress}`,
      setAddress,
      tokensToApprove: [...componentAddresses, setAddress]
    });
  }

  //
  async createSet2() {
    const { setProtocol } = this.state;

    const componentAddresses = [trueUsdAddress, daiAddress];
    const componentUnits = [new BigNumber(1), new BigNumber(2)];
    const naturalUnit = new BigNumber(1);
    const name = "My Set 2";
    const symbol = "MS2";
    const account = this.getAccount();
    const txOpts = {
      from: account,
      gas: 4000000,
      gasPrice: 8000000000
    };
    const details = await setProtocol.calculateSetUnitsAsync(
      componentAddresses,
      componentUnits,
      [new BigNumber(0.25), new BigNumber(0.75)],
      new BigNumber(10)
      // percentError
    );

    const txHash = await setProtocol.createSetAsync(
      componentAddresses,
      details.units,
      details.naturalUnit,
      name,
      symbol,
      txOpts
    );

    const set2Address = await setProtocol.getSetAddressFromCreateTxHashAsync(
      txHash
    );

    console.log("Tokens To Approve", componentAddresses);
    this.setState({
      createdSet2Link: `https://ropsten.etherscan.io/address/${set2Address}`,
      set2Address
    });
  }

  //

  // Approve tokens for transfer
  async approveTokensForTransfer() {
    const { setProtocol } = this.state;
    const tokenAddresses = this.state.tokensToApprove;

    tokenAddresses.forEach(async function(address) {
      console.log("approving..", address);
      const txhash = await setProtocol.setUnlimitedTransferProxyAllowanceAsync(
        address,
        {
          gas: 300000,
          gasPrice: 6000000000
        }
      );
      console.log("mining..", txhash);
      const mined = await setProtocol.awaitTransactionMinedAsync(txhash);
      if (mined) console.log("mined! tx hash:", txhash);
    });
  }

  async issueStableSet() {
    const { setProtocol } = this.state;
    const stableSetAddress = this.state.setAddress;
    // Issue 1x StableSet which equals 10 ** 18 base units.
    const issueQuantity = new BigNumber(10 * 10 ** 18);

    // Check that our issue quantity is divisible by the natural unit.
    const isMultipleOfNaturalUnit = await setProtocol.setToken.isMultipleOfNaturalUnitAsync(
      stableSetAddress,
      issueQuantity
    );

    if (isMultipleOfNaturalUnit) {
      try {
        return await setProtocol.issueAsync(stableSetAddress, issueQuantity, {
          from: userMetamaskAddress,
          gas: 4000000,
          gasPrice: 8000000000
        });
      } catch (err) {
        throw new Error(`Error when issuing a new Set token: ${err}`);
      }
    }
    throw new Error(
      `Issue quantity is not multiple of natural unit. Confirm that your issue quantity is divisible by the natural unit.`
    );
  }

  // Create Rebalancing Set
  async createDynamicDEXSet(initialSetAddress, managerAddress) {
    const { setProtocol } = this.state;
    const manager = userMetamaskAddress; // Make yourself the manager!
    const initialSet = this.state.setAddress; // Must be an array to conform to create interface
    const unitShares = [new BigNumber(10 ** 10)]; // Must be an array to conform to create interface
    const initialUnitShares = new BigNumber(10 ** 10); //TODO:

    // Calculate and set proposalPeriod and rebalanceInterval; must be calculated in seconds because
    // that is the unit of Ethereum timestamps. Though not relevant for this example, there is a
    // minimum rebalanceInterval and proposalPeriod of one day
    const ONE_WEEK_IN_SECONDS = 60 * 60 * 24 * 7;
    const ONE_MINUTE_IN_SECONDS = 60;
    const TWO_MINUTES_IN_SECONDS = 60 * 2;
    const THREE_MONTHS_IN_SECONDS = 60 * 60 * 24 * 30 * 3; // Assuming 30 days in a month
    const proposalPeriod = new BigNumber(ONE_MINUTE_IN_SECONDS);
    // In order to rebalance every quarter we must allow for the one week proposal period
    const rebalanceInterval = new BigNumber(
      TWO_MINUTES_IN_SECONDS - ONE_MINUTE_IN_SECONDS
    );

    const name = "Rebalancing DEX Set";
    const symbol = "dDEX";
    const txOpts = {
      from: userMetamaskAddress,
      gas: 4000000,
      gasPrice: 8000000000
    };

    console.log("PARAMS TO CREATE REBALANCE SET", {
      manager,
      initialSet,
      initialUnitShares,
      proposalPeriod,
      rebalanceInterval,
      name,
      symbol,
      txOpts
    });

    const txHash = await setProtocol.createRebalancingSetTokenAsync(
      manager,
      initialSet,
      initialUnitShares,
      proposalPeriod,
      rebalanceInterval,
      name,
      symbol,
      txOpts
    );

    console.log("Rebalancing Set Created. TX HASH: ", txHash);
    console.log("mining..");

    const mined = await setProtocol.awaitTransactionMinedAsync(txHash);

    if (mined) {
      console.log("mined! tx hash:", txHash);

      const rebalancingSetAddress = await setProtocol.getSetAddressFromCreateTxHashAsync(
        txHash
      );

      console.log("Rebalancing Set Created. ADDRESS: ", rebalancingSetAddress);

      this.setState({
        rebalancingSetAddress
      });

      return rebalancingSetAddress;
    }
  }

  async issueRebalancedSet() {
    const { setProtocol, rebalancingSetAddress } = this.state;

    // Issue 1x dynamic DEX Set which equals 10 ** 18 base units.
    const issueQuantity = new BigNumber(10 * 10 ** 18);

    const dynamicDEXSetAddress = rebalancingSetAddress;
    // Check that our issue quantity is divisible by the natural unit.
    const isMultipleOfNaturalUnit = await setProtocol.setToken.isMultipleOfNaturalUnitAsync(
      dynamicDEXSetAddress,
      issueQuantity
    );

    if (isMultipleOfNaturalUnit) {
      try {
        return await setProtocol.issueAsync(
          dynamicDEXSetAddress,
          issueQuantity,
          {
            from: userMetamaskAddress,
            gas: 4000000,
            gasPrice: 8000000000
          }
        );
      } catch (err) {
        throw new Error(
          `Error when issuing a new Dynamic DEX Set token: ${err}`
        );
      }
    }
    throw new Error(
      `Issue quantity is not multiple of natural unit. Confirm that your issue quantity is divisible by the natural unit.`
    );
  }

  getAccount() {
    const { web3 } = this.state;
    if (web3.eth.accounts[0]) return web3.eth.accounts[0];
    throw new Error("Your MetaMask is locked. Unlock it to continue.");
  }

  renderEtherScanLink(link, content) {
    return (
      <div className="App-button-container">
        <a target="_blank" rel="noopener" href={link}>
          {content}
        </a>
      </div>
    );
  }

  renderBalanceHtml(token, balance) {
    return (
      <div className="token-balance">
        <p>
          {token} Balance: {balance}
        </p>
      </div>
    );
  }

  async getRebalancedSetTokenBalances() {
    const { web3, setProtocol, rebalancingSetAddress, setAddress } = this.state;
    const setBalanceInVault = await setProtocol.getBalanceInVaultAsync(
      setAddress,
      rebalancingSetAddress
    );

    const setBalance = await setProtocol.getBalanceInVaultAsync(
      setAddress,
      rebalancingSetAddress
    );
    console.log(
      "SET BALANCE IN VAULT OF REBALANCING SET: ",
      setBalanceInVault / 1e18
    );
    console.log("SET BALANCE OF REBALANCING SET: ", setBalance / 1e18);

    this.setState({
      rebalancedSet1Balance: setBalance.toNumber() / 1e18
    });
  }

  async getInitialSetTokenBalances() {
    const { web3, setProtocol, setAddress } = this.state;
    const daiBalance = await setProtocol.erc20.getBalanceOfAsync(
      daiAddress,
      setAddress
    );
    const trueUsdBalance = await setProtocol.erc20.getBalanceOfAsync(
      trueUsdAddress,
      setAddress
    );
    console.log("DAI BALANCE OF SET: ", daiBalance / 1e18);
    console.log("TRUEUSD BALANCE OF SET: ", trueUsdBalance / 1e18);

    this.setState({
      setDaiBalance: daiBalance.toNumber() / 1e18,
      setTrueUsdBalance: trueUsdBalance.toNumber() / 1e18
    });
  }

  async getMySetTokenBalances() {
    const { web3, setProtocol, setAddress } = this.state;
    const mySetBalanceInVault = await setProtocol.getBalanceInVaultAsync(
      setAddress,
      userMetamaskAddress
    );
    const mySetBalance = await setProtocol.erc20.getBalanceOfAsync(
      setAddress,
      userMetamaskAddress
    );
    console.log("MY SET TOKEN BALANCE IN VAULT: ", mySetBalanceInVault / 1e18);
    console.log("MY SET TOKEN BALANCE: ", mySetBalance / 1e18);
  }

  async getMyTokenBalances() {
    const { web3, setProtocol } = this.state;
    const daiBalance = await setProtocol.erc20.getBalanceOfAsync(
      daiAddress,
      userMetamaskAddress
    );
    const trueUsdBalance = await setProtocol.erc20.getBalanceOfAsync(
      trueUsdAddress,
      userMetamaskAddress
    );
    // Call contract
    const deployed = new web3.eth.contract(abi, chainLinkContractAddress, {
      from: userMetamaskAddress,
      gasPrice: 40000000000,
      gas: 30000000
    });

    // console.log("DEPLOYED, ", deployed);
    // const res = await deployed.returnDaiValue();
    // console.log("RES:", res);

    console.log(" MY DAI BALANCE: ", daiBalance);
    console.log("MY TRUEUSD BALANCE: ", trueUsdBalance);

    this.setState({
      daiBalance: daiBalance.toNumber() / 1e18,
      trueUsdBalance: trueUsdBalance.toNumber() / 1e18
    });
  }

  async proposeRebalance() {
    console.log("Proposing Rebalance...");

    const linearAuction = "0x9b89072fcdf6fd38adbc2800ee88692976db8096";
    const constantPriceCurve = "0xda366f2c15c6c13975d183ffc670590ffa04d90a";

    const {
      web3,
      setProtocol,
      rebalancingSetAddress,
      set2Address
    } = this.state;
    // Set params
    console.log("1 ...");

    const dynamicDEXSetAddress = rebalancingSetAddress;
    const weightedDEXSetAddress = set2Address;
    const auctionLibrary = constantPriceCurve;
    console.log("2 ...");
    const curveCoefficient = new BigNumber(5);
    const auctionStartPrice = new BigNumber(900);
    const numberAuctionPriceDivisor = 1000;
    console.log("3 ...");

    const txOpts = {
      from: userMetamaskAddress,
      gas: 4000000,
      gasPrice: 8000000000
    };

    const txHash = await setProtocol.rebalancing.proposeAsync(
      dynamicDEXSetAddress, // rebalancingSetTokenAddress
      weightedDEXSetAddress, // nextSetAddress
      auctionLibrary, // address of linear auction library
      curveCoefficient,
      auctionStartPrice,
      new BigNumber(numberAuctionPriceDivisor),
      txOpts
    );

    console.log("Rebalancing Proposed.. TX: ", txHash);
    this.setState({
      rebalanceProposalTXHash: txHash
    });
    return txHash;
  }

  async redeemRebalance() {
    console.log("redeeming..");
    const { web3, setProtocol, setAddress, rebalancingSetAddress } = this.state;
    const stableSetAddress = rebalancingSetAddress;

    const quantity = new BigNumber(10 ** 3);
    const withdraw = true;
    const tokensToExclude = [];
    const txOpts = {
      from: userMetamaskAddress,
      gas: 4000000,
      gasPrice: 8000000000
    };

    const txHash = await setProtocol.redeemAsync(
      rebalancingSetAddress,
      quantity,
      withdraw,
      tokensToExclude,
      txOpts
    );
    console.log("REDEEMED. HASH: ", txHash);
    return txHash;
  }

  async bidOnRebalance() {
    console.log("bidding on Rebalance..");
    const { web3, setProtocol, rebalancingSetAddress } = this.state;

    const quantity = new BigNumber(10 ** 18);
    const txOpts = {
      from: userMetamaskAddress,
      gas: 4000000,
      gasPrice: 8000000000
    };

    // const rebalanceDetails = await setProtocol.rebalancing.getRebalanceDetails(
    //   rebalancingSetAddress
    // );
    // console.log(rebalanceDetails);
    console.log("bidding....");

    const txHash = await setProtocol.rebalancing.bidAsync(
      rebalancingSetAddress,
      quantity,
      txOpts
    );
    console.log("BID. HASH: ", txHash);
    return txHash;
  }

  async getBidPrice() {
    const { web3, setProtocol, setAddress, rebalancingSetAddress } = this.state;
    const rebalancingSetTokenAddress = rebalancingSetAddress;
    console.log("REBALANCING SET ADDRESS:", rebalancingSetAddress);
    const bidQuantity = new BigNumber(10 ** 18);

    const txHash = await setProtocol.rebalancing.getBidPriceAsync(
      rebalancingSetTokenAddress,
      bidQuantity
    );
    console.log("GETTING BID PRICE:", txHash);
    return txHash;
  }

  async rebalance() {
    const { web3, setProtocol, rebalancingSetAddress } = this.state;
    const rebalancingSetTokenAddress = rebalancingSetAddress;

    const txOpts = {
      from: userMetamaskAddress,
      gas: 4000000,
      gasPrice: 8000000000
    };

    const txHash = await setProtocol.rebalancing.rebalanceAsync(
      rebalancingSetTokenAddress,
      txOpts
    );

    console.log("REBALANCE CALLED. HASH: ", txHash);
    return txHash;
  }

  render() {
    const {
      createdSetLink,
      daiBalance,
      trueUsdBalance,
      setDaiBalance,
      setTrueUsdBalance,
      rebalancingSetAddress,
      rebalancedSet1Balance,
      rebalanceProposalTXHash,
      set2Address,
      createdSet2Link
    } = this.state;
    return (
      <div className="App">
        <header>
          <h1 className="App-title">Set Boiler Plate</h1>
        </header>

        {/* Create Set1 */}
        <button onClick={this.createSet}>Create My Set</button>

        {createdSetLink
          ? this.renderEtherScanLink(createdSetLink, "Link to your new Set")
          : null}
        {daiBalance ? this.renderBalanceHtml("YOUR DAI", daiBalance) : null}
        {trueUsdBalance
          ? this.renderBalanceHtml("YOUR TRUEUSD", trueUsdBalance)
          : null}

        {/* Approve Tokens for Set1 */}
        <button onClick={this.approveTokensForTransfer}>Approve Tokens</button>
        <ul>
          {this.state.tokensToApprove.map(t => (
            <li>{t}</li>
          ))}
        </ul>

        {/* Issue Set1 */}
        <button onClick={this.issueStableSet}>Issue Stable Set</button>
        {setDaiBalance ? this.renderBalanceHtml("DAI", setDaiBalance) : null}
        {setTrueUsdBalance
          ? this.renderBalanceHtml("TRUEUSD", setTrueUsdBalance)
          : null}

        {/* Create Rebalancing Set */}
        <button onClick={this.createDynamicDEXSet}>
          Create Rebalancing Set
        </button>

        {/* Issue Rebalancing */}
        <button onClick={this.issueRebalancedSet}>Issue Rebalanced Set</button>
        {rebalancedSet1Balance
          ? this.renderBalanceHtml("SET1", rebalancedSet1Balance)
          : null}

        {/* Issue Set 2 */}
        <button onClick={this.createSet2}>Create Set 2</button>
        {createdSet2Link
          ? this.renderEtherScanLink(createdSet2Link, "Link to your new Set")
          : null}
        {createdSet2Link ? <p> {createdSet2Link} </p> : null}

        {/* Propose Rebalance for Set 1 */}
        <button onClick={this.proposeRebalance}>Propose Rebalance</button>
        {rebalanceProposalTXHash ? (
          <p> Hash: {rebalanceProposalTXHash} </p>
        ) : null}

        {/* Bid on Rebalance for Set 1 */}
        <button onClick={this.bidOnRebalance}>bidding</button>

        {/* Get Bid Price */}
        <button onClick={this.getBidPrice}>Get Bid Price</button>

        {/* Settle Rebalance */}
        <button onClick={this.rebalance}> Rebalance</button>

        {/* Redeem Rebalance Set */}
        <button onClick={this.redeemRebalance}>Redeem Rebalance Set </button>
      </div>
    );
  }
}

export default App;
