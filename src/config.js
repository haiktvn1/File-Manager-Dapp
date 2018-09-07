var abiTemp = require("./ABI.json")
var config = {
  uportAppName: "Filemanager",
  contract: { // thay address và ABI của smart contract tại đây
    address: "0xe6fd4bd792e79c51802c7c5b767c9ccf56cd5423",
    abi: abiTemp, // thay ABI của smart contract
  },
  uport: { // thay bằng các thông số mà uport cung cấp tại đây
    mnidAddress: "2ovMuFxV6zykSG5CAvTGPGsBsMVPid8ysFN",
    signingKey:
      "4dbe967bedbed5ac0ee76e9d41717b3760b62e677e12f5d421c88ae31c17dee4", 
    appName: "Filemanager"
  }
};
export default config;
