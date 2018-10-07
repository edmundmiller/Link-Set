pragma solidity ^0.4.22;

import "./CoinMarketCapChainlink.sol";

contract MakeRebalance is CoinMarketCapChainlink {

    string daiAPICode = "DAI";
    string chainlinkAPICode = "LINK";

    uint256 daiPrice;
    uint256 chainlinkPrice;

    bytes32 daiRequest;
    bytes32 clRequest;

    function calculateValues() public {
        daiRequest = requestCoinMarketCapPrice(daiAPICode, "USD");
        clRequest = requestCoinMarketCapPrice(chainlinkAPICode, "USD");
    }

    function checkRequest(bytes32 requestId, uint256 coinPrice) public
        checkChainlinkFulfillment(requestId)
    {
        if (requestId == daiRequest) {
            daiPrice = coinPrice;
        } else {
            chainlinkPrice = coinPrice;
        }
    }

    function returnDaiValue() public view returns(uint256) {
        return daiPrice;
    }

    function returnClValues() public view returns(uint256) {
        return chainlinkPrice;
    }
}
