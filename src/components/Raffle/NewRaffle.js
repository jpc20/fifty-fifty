import { useState, useEffect } from "react";
import { ethers } from "ethers";
import RaffleFactory from "../../artifacts/contracts/Raffle.sol/RaffleFactory.json";
import { Grid, TextField, } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import NumberFormat from "react-number-format";
import LoadingButton from "../LoadingButton";
import ErrorMessage from "../ErrorMessage";

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
  setCurrentTabValue,
  setFilter,
  getRaffles,
  signer,
  provider,
  userAddress,
  userConnected,
}) => {
  const [ticketPrice, setTicketPriceValue] = useState(0.001);
  const [beneficiary, setBeneficiaryValue] = useState("");
  const [description, setDescriptionValue] = useState("");
  const [symbol, setSymbolValue] = useState("");
  const [loading, setLoadingValue] = useState(false);
  const [validAddress, setValidAddressValue] = useState(true);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("false");
  const classes = useStyles();

  async function deployRaffle(event) {
    setLoadingValue(true);
    event.preventDefault();
    if (!ticketPrice || !beneficiary) return;
    if (typeof window.ethereum !== "undefined") {
      const factory = new ethers.Contract(
        raffleFactoryAddress,
        RaffleFactory.abi,
        signer
      );
      const formattedPrice = ethers.utils.parseEther(ticketPrice.toString());
      try {
        const deployTxn = await factory.createRaffle(
          description,
          symbol,
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
        setErrorMessage(err.message)
        setError(true);
        setLoadingValue(false);
      }
    }
  }
  useEffect(() => {
    const getAddress = async () => {
      setBeneficiaryValue(userAddress);
    };
    getAddress();
  }, [userAddress]);

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
      <ErrorMessage error={error} errorMessage={errorMessage} setError={setError}/>
      <Grid container spacing={3} className={classes.root}>
        <Grid item xs={12}>
          {validAddress ? (
            <TextField
              label="Beneficiary Address"
              disabled={loading}
              onChange={(e) => setBeneficiaryValue(e.target.value)}
              value={beneficiary}
            />
          ) : (
            <TextField
              error
              label="Beneficiary Address"
              variant="outlined"
              helperText="Please Enter a Valid Address"
              onChange={(e) => setBeneficiaryValue(e.target.value)}
              value={beneficiary}
            />
          )}
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Description"
            disabled={loading}
            onChange={(e) => setDescriptionValue(e.target.value)}
            value={description}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Symbol"
            disabled={loading}
            onChange={(e) => setSymbolValue(e.target.value)}
            value={symbol}
          />
        </Grid>
        <Grid item xs={12}>
          <NumberFormat
            value={ticketPrice}
            customInput={TextField}
            label="Ticket Price(ETH)"
            prefix={"Ξ"}
            decimalScale={10}
            type="text"
            disabled={loading}
            onChange={(e) => setTicketPriceValue(e.target.value.substring(1))}
          />
        </Grid>
        <Grid item xs={12}>
          <LoadingButton
            buttonText="Deploy Raffle"
            loading={loading}
            disabled={!validAddress || description.length < 1}
            userConnected={userConnected}
          />
        </Grid>
      </Grid>
    </form>
  );
};

export default NewRaffle;
