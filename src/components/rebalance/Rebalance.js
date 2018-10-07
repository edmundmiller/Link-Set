import React, { Component } from "react";

import setProtocol from "setprotocol.js";
import BigNumber from "bignumber.js";

class Rebalance extends Component {
  constructor() {
    super();

    this.setAllDecimals = this.setAllDecimals.bind(this);
    this.balanceSet = this.balanceSet.bind(this);
  }

  async setAllDecimals() {
    const sourceTokenDecimals = await setProtocol.erc20
      .getDecimalsAsync
      // makerToken
      ();
    const chainlinkDecimals = await setProtocol.erc20
      .getDecimalsAsync
      // chainlinkAddress
      ();
    const daiDecimals = await setProtocol.erc20
      .getDecimalsAsync
      // daiAddress
      ();
    this.setState({
      sourceTokenDecimals,
      chainlinkDecimals,
      daiDecimals
    });
  }

  balanceSet() {}
  render() {
    return (
      <div className="Rebalance">
        <button onClick={this.balanceSet}>Rebalance My Set</button>
      </div>
    );
  }
}
export default Rebalance;
