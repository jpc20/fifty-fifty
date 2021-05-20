import "./App.css";
import { ethers } from "ethers";
import DeployedRaffles from "./components/Raffle/DeployedRaffles";
import { Divider, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import LoadingButton from "./components/LoadingButton";
import { useState, useEffect, useCallback } from "react";

const raffleFactoryAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // local
// const raffleFactoryAddress = "0xeee7874BaF2BFEB1df7E09D55A56594A50ACFae2"; // ropsten
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  paper: {
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
    whiteSpace: "nowrap",
    marginBottom: theme.spacing(1),
  },
  divider: {
    margin: theme.spacing(2, 0),
  },
}));

function App() {
  const [signer, setSigner] = useState("");
  const [provider, setProvider] = useState("");
  const [userAddress, setUserAddress] = useState("");
  const [userConnected, setUserConnected] = useState(false);
  const [apiConnected, setApiConnected] = useState(false);
  const [accountLoading, setAccountLoading] = useState(false);
  const classes = useStyles();

  async function requestAccount() {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }

  const checkNetwork = async () => {
    const networks = {
      "0x1": "mainnet",
      "0x2a": "koval",
      "0x5": "goerli",
      "0x3": "ropsten",
      "0x4": "rinkeby",
    };
    const chainId = await window.ethereum.request({ method: "eth_chainId" });
    return networks[chainId];
  };

  const connectAccount = useCallback(async () => {
    setAccountLoading(true);
    await requestAccount();
    const providerResp = new ethers.providers.Web3Provider(window.ethereum);
    const signerResp = providerResp.getSigner();
    const address = await signerResp.getAddress();
    setSigner(signerResp);
    setProvider(providerResp);
    setUserAddress(address);
    setUserConnected(true);
    setAccountLoading(false);
  }, []);

  const connectApi = useCallback(async () => {
    const providerResp = new ethers.providers.JsonRpcProvider();
    const signerResp = providerResp.getSigner();
    const address = await signerResp.getAddress();
    setUserAddress(address);
    setProvider(providerResp);
    setSigner(signerResp);
    setApiConnected(true);
    setUserConnected(false);
  }, []);

  const isMetaMaskConnected = useCallback(async () => {
    const { ethereum } = window;
    if (ethereum) {
      var provider = new ethers.providers.Web3Provider(ethereum);
    }
    const accounts = await provider.listAccounts();
    return accounts.length > 0;
  }, []);

  useEffect(() => {
    isMetaMaskConnected().then((metaMaskResp) => {
      if (metaMaskResp === true) {
        connectAccount();
      } else {
        connectApi();
      }
    });
  }, [connectAccount, connectApi, isMetaMaskConnected]);

  return (
    <div className={classes.root}>
      <div className="App-header">
        <div className="account-button">
          <LoadingButton
            buttonText={
              userConnected
                ? userAddress.slice(0, 6) + "..." + userAddress.slice(37, -1)
                : "Connect Account"
            }
            onClickHandler={connectAccount}
            loading={accountLoading}
            variant="outlined"
            buttonType="account"
          />
        </div>
      </div>
      <Typography variant="h2">50/50 Raffle</Typography>
      <Typography variant="subtitle1" gutterBottom>
        Built by @jpc20
      </Typography>
      <Typography variant="caption" color="secondary" gutterBottom>
        [Rinkbey Testnet]
      </Typography>
      <Divider className={classes.divider} />
      <DeployedRaffles
        connectAccount={connectAccount}
        raffleFactoryAddress={raffleFactoryAddress}
        checkNetwork={checkNetwork}
        signer={signer}
        provider={provider}
        userAddress={userAddress}
        userConnected={userConnected}
        apiConnected={apiConnected}
      />
    </div>
  );
}

export default App;
