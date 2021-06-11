import "./App.css";
import { ethers } from "ethers";
import DeployedRaffles from "./components/Raffle/DeployedRaffles";
import { Divider, Typography, CssBaseline, IconButton } from "@material-ui/core";
import { makeStyles, createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { Brightness3, WbSunny } from "@material-ui/icons";
import LoadingButton from "./components/LoadingButton";
import { useState, useEffect, useCallback } from "react";

// const raffleFactoryAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // local
const raffleFactoryAddress = "0xE68FfBe40CF75D6D7361b0e28F0e71A9b6AAA920"; // rinkeby
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

const darkTheme = createMuiTheme({
  palette: {
    type: "dark",
    primary: {
      main: "#612ba8",
    },
    secondary: {
      main: "#f44336",
    },
  },
});
const lightTheme = createMuiTheme({
  palette: {
    type: "light",
    primary: {
      main: "#612ba8",
    },
    secondary: {
      main: "#f44336",
    },
  },
});

function App() {
  const [signer, setSigner] = useState("");
  const [provider, setProvider] = useState("");
  const [userAddress, setUserAddress] = useState("");
  const [network, setNetwork] = useState("");
  const [userConnected, setUserConnected] = useState(false);
  const [apiConnected, setApiConnected] = useState(false);
  const [accountLoading, setAccountLoading] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(darkTheme);
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
    try {
      const providerResp = new ethers.providers.InfuraProvider("rinkeby");
      const wallet = new ethers.Wallet(process.env.REACT_APP_RINKEBY_KEY);
      const signerResp = new ethers.VoidSigner(wallet.address, providerResp);
      setUserAddress(wallet.address);
      setProvider(providerResp);
      setSigner(signerResp);
      setApiConnected(true);
      setUserConnected(false);
    } catch (error) {
      console.log(error);
    }
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

  useEffect(() => {
    checkNetwork().then((network) => setNetwork(network))
  }, [])

  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline />
      <div className={classes.root}>
        <div className="App-header">
          <div>
            <IconButton onClick={() => setCurrentTheme(lightTheme)}>
              <WbSunny />
            </IconButton>
            <IconButton onClick={() => setCurrentTheme(darkTheme)}>
              <Brightness3 />
            </IconButton>
          </div>
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
        <Typography
          variant="caption"
          color={network === "rinkeby" ? "inherit" : "secondary"}
          gutterBottom
        >
          {network === "rinkeby"
            ? "[Connected to Rinkbey Testnet]"
            : "[Please connect to the Rinkeby Testnet]"}
        </Typography>
        <Divider className={classes.divider} />
        <DeployedRaffles
          connectAccount={connectAccount}
          raffleFactoryAddress={raffleFactoryAddress}
          signer={signer}
          provider={provider}
          userAddress={userAddress}
          userConnected={userConnected}
          apiConnected={apiConnected}
        />
      </div>
    </ThemeProvider>
  );
}

export default App;
