const createDEXSet = async function(
  allocation: BigNumber[],
  name: string,
  symbol: string
) {
  const zrxAddress = "ZRX_ADDRESS";
  const kncAddress = "KNC_ADDRESS";

  componentAddresses = [zrxAddress, kncAddress];
  const { units, naturalUnit } = await setProtocol.calculateSetUnitsAsync(
    componentAddresses,
    [new BigNumber(0.6), new BigNumber(0.4)], // ZRX and KNC are $0.60 and $0.40, respectively
    allocation, // Allocations passed in
    new BigNumber(100) // DEXSet will have a $100 target price
  );

  const txOpts = {
    from: "0xYourMetaMaskAddress",
    gas: 4000000,
    gasPrice: 8000000000
  };

  const txHash = await setProtocol.createSetAsync(
    componentAddresses,
    units,
    naturalUnit,
    name,
    symbol,
    txOpts
  );
  return await setProtocol.getSetAddressFromCreateTxHashAsync(txHash);
};

// Initial Set is 50/50 allocation of ZRX and KNC
initialAllocation = [new BigNumber(0.5), new BigNumber(0.5)];
const initialSetAddress = await createDEXSet(
  initialAllocation,
  "DEX Set",
  "DEX"
);





