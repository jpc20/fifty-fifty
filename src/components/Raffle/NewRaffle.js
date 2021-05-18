import { useState, useEffect } from "react";
import { ethers } from "ethers";
import RaffleFactory from "../../artifacts/contracts/Raffle.sol/RaffleFactory.json";
import { Grid, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import NumberFormat from "react-number-format";
import LoadingButton from "../LoadingButton";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "25ch",
      flexGrow: 1,
      textAlign: "center",
      justifyContent: "center",
    },
  },
}));

const NewRaffle = ({
  raffleFactoryAddress,
  getSignerAndProvider,
  setCurrentTabValue,
  setFilter,
  getRaffles,
}) => {
  const [ticketPrice, setTicketPriceValue] = useState(0.001);
  const [beneficiary, setBeneficiaryValue] = useState("");
  const [loading, setLoadingValue] = useState(false);
  const [validAddress, setValidAddressValue] = useState(true);
  const classes = useStyles();

  async function deployRaffle(event) {
    setLoadingValue(true);
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
        const deployTxn = await factory.createRaffle(
          formattedPrice,
          beneficiary
        );
        provider.once(deployTxn.hash, (transaction) => {
          setLoadingValue(false);
          setCurrentTabValue(2);
          setFilter("owned");
          getRaffles();
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

  useEffect(() => {
    const checkAddress = async () => {
      try {
        await ethers.utils.getAddress(beneficiary);
        setValidAddressValue(true);
      } catch (error) {
        if (beneficiary.length !== 0) setValidAddressValue(false);
      }
    };
    checkAddress();
  }, [beneficiary]);

  return (
    <form
      className={classes.root}
      noValidate
      autoComplete="off"
      onSubmit={(e) => deployRaffle(e)}
    >
      <Grid container spacing={3} className={classes.root}>
        <Grid item xs={12}>
          {validAddress ? (
            <TextField
              label="Address"
              variant="outlined"
              onChange={(e) => setBeneficiaryValue(e.target.value)}
              value={beneficiary}
            />
          ) : (
            <TextField
              error
              label="Address"
              variant="outlined"
              helperText="Please Enter a Valid Address"
              onChange={(e) => setBeneficiaryValue(e.target.value)}
              value={beneficiary}
            />
          )}
        </Grid>
        <Grid item xs={12}>
          <NumberFormat
            value={ticketPrice}
            customInput={TextField}
            label="Ticket Price(ETH)"
            prefix={"Ξ"}
            decimalScale={10}
            type="text"
            onChange={(e) => setTicketPriceValue(e.target.value.substring(1))}
          />
        </Grid>
        <Grid item xs={12}>
          <LoadingButton buttonText="Deploy Raffle" loading={loading} />
        </Grid>
      </Grid>
    </form>
  );
};

export default NewRaffle;
