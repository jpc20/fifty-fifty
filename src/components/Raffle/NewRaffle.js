import { useState, useEffect } from "react";
import { ethers } from "ethers";
import RaffleFactory from "../../artifacts/contracts/Raffle.sol/RaffleFactory.json";
import { Grid, TextField, Button, CircularProgress } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import NumberFormat from "react-number-format";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "25ch",
      flexGrow: 1,
      textAlign: "center",
      justifyContent: "center",
      alignItems: "center",
    },
  },
}));

const NewRaffle = ({ raffleFactoryAddress, getSignerAndProvider }) => {
  const [ticketPrice, setTicketPriceValue] = useState(0.001);
  const [beneficiary, setBeneficiaryValue] = useState("");
  const [loading, setLoadingValue] = useState(false);
  const classes = useStyles();

  const submitButton = () => {
    if (loading) {
      return (
        <Button>
          <CircularProgress />
        </Button>
      );
    } else {
      return (
        <Button type="submit" variant="contained" color="primary">
          Deploy Raffle
        </Button>
      );
    }
  };
  async function deployRaffle(event) {
    setLoadingValue(true)
    event.preventDefault();
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
        const deployTxn = await factory.createRaffle(formattedPrice, beneficiary);
        provider.once(deployTxn.hash, (transaction) => {
            setLoadingValue(false);
        });
    } catch (err) {
        console.log("Error: ", err);
        setLoadingValue(false);
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
      <form
        className={classes.root}
        noValidate
        autoComplete="off"
        onSubmit={(e) => deployRaffle(e)}
      >
        <Grid container spacing={3} className={classes.root}>
          <Grid item xs={12}>
            <TextField
              id="outlined-required"
              variant="outlined"
              onChange={(e) => setBeneficiaryValue(e.target.value)}
              value={beneficiary}
            />
          </Grid>
          <Grid item xs={12}>
            <NumberFormat
              value={ticketPrice}
              customInput={TextField}
              prefix={"Ξ"}
              decimalScale={10}
              type="text"
              onChange={(e) => setTicketPriceValue(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            {submitButton()}
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default NewRaffle;
