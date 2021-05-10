import { useState, useEffect } from "react";
import { ethers } from "ethers";
import RaffleFactory from "../artifacts/contracts/Raffle.sol/RaffleFactory.json";
import {Grid, TextField, Button} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "25ch",
    },
  },
}));

const NewRaffle = ({ raffleFactoryAddress, getSignerAndProvider }) => {
  const [ticketPrice, setTicketPriceValue] = useState(0.01);
  const [beneficiary, setBeneficiaryValue] = useState("");
  const classes = useStyles();

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
    useEffect(() => {
      const getAddress = async () => {
        const [provider, signer, address] = await getSignerAndProvider();
        setBeneficiaryValue(address);
      };
      getAddress();
    }, []);

  return (
    <div>
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
    </div>
  );
};

export default NewRaffle;
