import React, { Component } from 'react';
import './App.css';

import SetProtocol from 'setprotocol.js';
import BigNumber from 'bignumber.js';

// Kovan configuration
const config = {
  coreAddress: '0x29f13822ece62b7a436a45903ce6d5c97d6e4cc9',
  setTokenFactoryAddress: '0x6c51d8dad8404dbd91e8ab063d21e85ddec9f626',
  transferProxyAddress: '0xd50ddfed470cc13572c5246e71d4cfb4aba73def',
  vaultAddress: '0x014e9b34486cfa13e9a2d87028d38cd98f996c8c',
};

class App extends Component {
  constructor() {
    super();
    const injectedWeb3 = window.web3 || undefined;
    let setProtocol;
    try {
      // Use MetaMask/Mist provider
      const provider = injectedWeb3.currentProvider;
      setProtocol = new SetProtocol(provider, config);
    } catch (err) {
      // Throws when user doesn't have MetaMask/Mist running
      throw new Error(`No injected web3 found when initializing setProtocol: ${err}`);
    }

    this.state = {
      setProtocol,
      web3: injectedWeb3,
      // Etherscan Links
      createdSetLink: '',
    };
    this.createSet = this.createSet.bind(this);
    this.getAccount = this.getAccount.bind(this);
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
    const trueUsdAddress = '0xadb015d61f4beb2a712d237d9d4c5b75bafefd7b';
    const daiAddress = '0x1d82471142f0aeeec9fc375fc975629056c26cee';

    const componentAddresses = [trueUsdAddress, daiAddress];
    const componentUnits = [new BigNumber(5), new BigNumber(5)];
    const naturalUnit = new BigNumber(10);
    const name = 'My Set';
    const symbol = 'MS';
    const account = this.getAccount();
    const txOpts = {
      from: account,
      gas: 4000000,
      gasPrice: 8000000000,
    };

    const txHash = await setProtocol.createSetAsync(
      componentAddresses,
      componentUnits,
      naturalUnit,
      name,
      symbol,
      txOpts,
    );
    const setAddress = await setProtocol.getSetAddressFromCreateTxHashAsync(txHash);
    this.setState({ createdSetLink: `https://kovan.etherscan.io/address/${setAddress}` });
  }

  async issueSet() {
    /**
      * Steps to Issue your Set Token
      * -----------------------------
      *
      * 1. Get TestNet TrueUSD and Dai
      *   - Navigate to the links below:
      *     - TrueUSD: https://kovan.etherscan.io/address/0xadb015d61f4beb2a712d237d9d4c5b75bafefd7b#writeContract
      *     - Dai:     https://kovan.etherscan.io/address/0x1d82471142f0aeeec9fc375fc975629056c26cee#writeContract
      *   - Click `Connect with MetaMask` link in the `Write Contract` tab. Click `OK` in the modal that shows up.
      *   - In the `greedIsGood` function, put in:
      *     - _to: Your MetaMask address
      *     - _value: 100000000000000000000000
      *   - Click the `Write` button
      *   - Confirm your MetaMask transaction
      *   - You now have TestNet tokens for TrueUSD/Dai.
      *   - Be sure to repeat the process for the other remaining TrueUSD/Dai token.
      */

    // Tutorial Link: https://docs.setprotocol.com/tutorials#issuing-a-set
    // TODO: Insert your code here
  }

  getAccount() {
    const { web3 } = this.state;
    if (web3.eth.accounts[0]) return web3.eth.accounts[0];
    throw new Error('Your MetaMask is locked. Unlock it to continue.');
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

  render() {
    const { createdSetLink } = this.state;
    return (
      <div className="App">
        <header>
          <h1 className="App-title">Set Boiler Plate</h1>
        </header>
        <button onClick={this.createSet}>
          Create My Set
        </button>
        { createdSetLink ? this.renderEtherScanLink(createdSetLink, 'Link to your new Set') : null }
      </div>
    );
  }
}

export default App;
