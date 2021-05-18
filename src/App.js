import "./App.css";
import { ethers } from "ethers";
import DeployedRaffles from "./components/Raffle/DeployedRaffles";
import { Divider, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

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
  }

  const getSignerAndProvider = async () => {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      return [provider, signer, address];
  }

  return (
    <div className={classes.root}>
      <Typography variant="h1">50/50 Raffle</Typography>
      <Typography variant="subtitle1" gutterBottom>
        Built by @jpc20
      </Typography>
      <Typography variant="caption" color="secondary" gutterBottom>
        [Rinkbey Testnet]
      </Typography>
      <Divider className={classes.divider} />
      <DeployedRaffles
        getSignerAndProvider={getSignerAndProvider}
        raffleFactoryAddress={raffleFactoryAddress}
        checkNetwork={checkNetwork}
      />
    </div>
  );
}

export default App;
