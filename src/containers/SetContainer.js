import React, { Component } from "react";

// Redux
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { createSet } from "../state/actions/setProtocolActions";
import * as actions from "../state/actions/apiActions";

// import {
// 	dispatchGetWeb3,
// 	dispatchSetProtocol
// } from "../state/actions/apiActions";

import SetProtocol from "setprotocol.js";
import BigNumber from "bignumber.js";

// Hardcoded shit
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

class CreateSetContainer extends Component {
	constructor(props) {
		super(props);

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
		console.log("pre dispatch");
		actions.dispatchGetWeb3(injectedWeb3);
		console.log("mid dispatch");
		actions.dispatchSetProtocol(setProtocol);
		console.log("post dispatch");

		this.state = {
			setProtocol,
			web3: injectedWeb3,
			createdSetLink: "",
			daiBalance: "",
			trueUsdBalance: "",
			setAddress: ""
		};
	}

	async componentWillReceiveProps(nextProps) {
		console.log(nextProps);
		if (nextProps.api.setProtocol && nextProps.api.web3) {
			await this.getMyTokenBalances();
		}
	}

	async createSet() {
		const { setProtocol } = this.props.api;

		/**
		 * Steps to create your own Set Token
		 * ----------------------------------
		 *
		 * 1. Fund your MetaMask wallet with Kovan ETH: https://gitter.im/kovan-testnet/faucet
		 * 2. Modify your Set details below to your liking
		 * 3. Click `Create My Set`
		 */

		const componentAddresses = [trueUsdAddress, daiAddress];
		const componentUnits = [new BigNumber(5), new BigNumber(5)];
		const naturalUnit = new BigNumber(10);
		const name = "My Set";
		const symbol = "MS";
		const account = this.getAccount();
		const txOpts = {
			from: account,
			gas: 4000000,
			gasPrice: 8000000000
		};

		await this.props.createSet(
			componentAddresses,
			componentUnits,
			naturalUnit,
			name,
			symbol,
			txOpts
		);
	}

	getAccount() {
		const { web3 } = this.props.api;
		if (web3.eth.accounts[0]) return web3.eth.accounts[0];
		throw new Error("Your MetaMask is locked. Unlock it to continue.");
	}

	async getMyTokenBalances() {
		const { web3, setProtocol } = this.props.api;

		const daiBalance = await setProtocol.erc20.getBalanceOfAsync(
			daiAddress,
			userMetamaskAddress
		);
		const trueUsdBalance = await setProtocol.erc20.getBalanceOfAsync(
			trueUsdAddress,
			userMetamaskAddress
		);
		console.log("DAI BALANCE: ", daiBalance);
		console.log("TRUEUSD BALANCE: ", trueUsdBalance);

		this.setState({
			daiBalance: daiBalance.toNumber() / 1e18,
			trueUsdBalance: trueUsdBalance.toNumber() / 1e18
		});
	}

	// Render Conditional HTML
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

	render() {
		const { createdSetLink } = this.props.set;
		const { daiBalance, trueUsdBalance } = this.state;

		return (
			<React.Fragment>
				<button onClick={this.props.createSet}>Create My Set</button>
				{createdSetLink
					? this.renderEtherScanLink(
							createdSetLink,
							"Link to your new Set"
					  )
					: null}
				{daiBalance ? this.renderBalanceHtml("DAI", daiBalance) : null}
				{trueUsdBalance
					? this.renderBalanceHtml("TRUEUSD", trueUsdBalance)
					: null}
				{createdSetLink
					? this.renderIssueSetHtml(
							createdSetLink,
							"Link to your new Set"
					  )
					: null}
			</React.Fragment>
		);
	}
}

const mapStateToProps = state => ({
	set: state.set,
	api: state.api
});

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(CreateSetContainer);
