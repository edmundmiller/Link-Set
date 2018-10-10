pragma solidity ^0.4.22;

import "../node_modules/chainlink/solidity/contracts/Chainlinked.sol";

contract CoinMarketCapChainlink is Chainlinked {
    constructor()
        public
    {
        // Set to the Ropsten addresses
        setLinkToken(0x581b528e953f6d3285a319e753de4c44543b8cc9);
        setOracle(0x20c2a56e29037b4976b4bb3816f92d7acb0a8c9f);
    }

    bytes32 SPEC_ID = bytes32("96b6a7fca7594887a3c3c3c0f9379e4e");

    // Get the Coin Market Cap info for the coin
    function requestCoinMarketCapPrice(string _coin, string _market)
        public
        // onlyOwner
        returns (bytes32 requestId)
    {
        ChainlinkLib.Run memory run = newRun(SPEC_ID, this, "checkRequest(bytes32,uint256)");
        run.add("sym", _coin);
        run.add("convert", _market);
        string[] memory path = new string[](5);
        path[0] = "data";
        path[1] = _coin;
        path[2] = "quote";
        path[3] = _market;
        path[4] = "price";
        run.addStringArray("copyPath", path);
        run.addInt("times", 100);
        requestId = chainlinkRequest(run, LINK(1));
    }
}
