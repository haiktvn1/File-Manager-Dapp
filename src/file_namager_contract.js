import { web3 } from "./uport";
import config from "./config";

let FileManagerContract = web3.eth.contract(config.contract.abi);
let contractInstance = FileManagerContract.at(config.contract.address);
export default contractInstance;
