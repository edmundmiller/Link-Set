import React, { Component } from "react";
import "./App.css";

// Redux
import { Provider } from "react-redux";
import store from "./state/store";
import {
  dispatchGetWeb3,
  dispatchSetProtocol
} from "./state/actions/apiActions";

// Components
import CreateSetContainer from "./containers/SetContainer";

import SetProtocol from "setprotocol.js";
import BigNumber from "bignumber.js";

// Metamask configuration
const userMetamaskAddress = "0xafd860a9ac1e1f29e1efa102f82081cd38626054";
const trueUsdAddress = "0xadb015d61f4beb2a712d237d9d4c5b75bafefd7b";
const daiAddress = "0x1d82471142f0aeeec9fc375fc975629056c26cee";

// Kovan configuration
const config = {
  coreAddress: "0x29f13822ece62b7a436a45903ce6d5c97d6e4cc9",
  setTokenFactoryAddress: "0x6c51d8dad8404dbd91e8ab063d21e85ddec9f626",
  transferProxyAddress: "0xd50ddfed470cc13572c5246e71d4cfb4aba73def",
  vaultAddress: "0x014e9b34486cfa13e9a2d87028d38cd98f996c8c"
};

class App extends Component {
  constructor() {
    super();

    // this.getAccount = this.getAccount.bind(this);
  }

  componentWillMount() {
    const injectedWeb3 = window.web3 || undefined;
    let setProtocol;
    try {
      // Use MetaMask/Mist provider
      const provider = injectedWeb3.currentProvider;
      setProtocol = new SetProtocol(provider, config);
    } catch (err) {
      // Throws when user doesn't have MetaMask/Mist running
      throw new Error(
        `No injected web3 found when initializing setProtocol: ${err}`
      );
    }

    this.setState({
      setProtocol,
      web3: injectedWeb3,
      createdSetLink: "",
      daiBalance: "",
      trueUsdBalance: "",
      setAddress: ""
    });
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

  render() {
    return (
      <Provider store={store}>
        <div className="App">
          <header>
            <h1 className="App-title">Set Boiler Plate</h1>
          </header>
          <CreateSetContainer />
        </div>
      </Provider>
    );
  }
}

export default App;
