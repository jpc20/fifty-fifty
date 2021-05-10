import "./App.css";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import RaffleFactory from "./artifacts/contracts/Raffle.sol/RaffleFactory.json";
import DeployedRaffles from "./components/DeployedRaffles";
import { Button, Divider, Grid, Typography } from "@material-ui/core";
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
  const [ticketPrice, setTicketPriceValue] = useState(0.01);
  const [beneficiary, setBeneficiaryValue] = useState("");
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

  useEffect(() => {
    const getAddress = async () => {
      const [provider, signer, address] = await getSignerAndProvider();
      setBeneficiaryValue(address);
    };
    getAddress();
  }, []);

  async function deployRaffle() {
    if (!ticketPrice || !beneficiary) return;
    if (typeof window.ethereum !== "undefined") {
      const [provider, signer, address] = await getSignerAndProvider();
      const factory = new ethers.Contract(
        raffleFactoryAddress,
        RaffleFactory.abi,
        signer
      );
      const formattedPrice = ethers.utils.parseEther(ticketPrice.toString());
      try {
        await factory.createRaffle(formattedPrice, beneficiary);
      } catch (err) {
        console.log("Error: ", err);
      }
    }
  }

  return (
    <div className={classes.root}>
      <Typography variant="h1" gutterBottom>
        50/50 Raffle
      </Typography>
      <Grid container spacing={3} className={classes.root}>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={deployRaffle}>
            Deploy Raffle
          </Button>
        </Grid>
        <Grid item xs={12}>
          <input
            onChange={(e) => setTicketPriceValue(e.target.value)}
            placeholder="Set ticket price"
            value={ticketPrice}
          />
        </Grid>
        <Grid item xs={12}>
          <input
            onChange={(e) => setBeneficiaryValue(e.target.value)}
            placeholder="Beneficiary"
            value={beneficiary}
          />
        </Grid>
      </Grid>
      <Divider className={classes.divider} />
      <DeployedRaffles
        getSignerAndProvider={getSignerAndProvider}
        raffleFactoryAddress={raffleFactoryAddress}
      />
    </div>
  );
}

export default App;
