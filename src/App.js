import "./App.css";
import { useState } from "react";
import { ethers } from "ethers";
import DeployedRaffles from "./components/Raffle/DeployedRaffles";
import { Button, Divider, Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import NewRaffle from "./components/Raffle/NewRaffle";

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
  const [raffleFilter, setRaffleFilter] = useState("open")
  const classes = useStyles();

  async function requestAccount() {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }

  async function getSignerAndProvider() {
    await requestAccount();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    return [provider, signer, address];
  }

  function changeRaffleFilter(newFilter) {
      setRaffleFilter(newFilter);
  }

  return (
    <div className={classes.root}>
      <Typography variant="h1" gutterBottom>
        50/50 Raffle
      </Typography>
      <NewRaffle
        raffleFactoryAddress={raffleFactoryAddress}
        getSignerAndProvider={getSignerAndProvider}
      />
      <Divider className={classes.divider} />
      <Button onClick={(e) => changeRaffleFilter("open")}>Open Raffles</Button>
      <Button onClick={(e) => changeRaffleFilter("closed")}>Closed Raffles</Button>
      <Button onClick={(e) => changeRaffleFilter("owned")}>Your Raffles</Button>
      <DeployedRaffles
        getSignerAndProvider={getSignerAndProvider}
        raffleFactoryAddress={raffleFactoryAddress}
        raffleFilter={raffleFilter}
      />
    </div>
  );
}

export default App;
