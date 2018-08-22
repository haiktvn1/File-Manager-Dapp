import { Connect, SimpleSigner } from "uport-connect";
import config from "./config";
const uport = new Connect(config.uport.appName, {
  clientId: config.uport.mnidAddress,
  network: "rinkeby",
  signer: SimpleSigner(config.uport.signingKey)
});

const web3 = uport.getWeb3();
export { web3, uport };
