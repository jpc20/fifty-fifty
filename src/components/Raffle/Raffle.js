import { useState } from "react";
import { ethers } from "ethers";
import RaffleContract from "../../artifacts/contracts/Raffle.sol/Raffle.json";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Typography, Paper, IconButton } from "@material-ui/core";
import { ExpandMore, ExpandLess } from "@material-ui/icons";
import LoadingButton from "../LoadingButton";
import ErrorMessage from "../ErrorMessage";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    overflow: "hidden",
    padding: theme.spacing(0, 3),
  },
  paper: {
    margin: `${theme.spacing(1)}px auto`,
    padding: theme.spacing(2),
    maxWidth: "95%",
  },
}));

const Raffle = ({
  raffleTicketPrice,
  beneficiary,
  description,
  userTicketCount,
  totalTicketCount,
  balance,
  isOwner,
  open,
  raffleAddress,
  raffleFilter,
  getRaffles,
  signer,
  provider,
  userAddress,
  userConnected,
}) => {
  const [purchaseLoading, setPurchaseLoadingValue] = useState(false);
  const [distributeLoading, setDistributeLoadingValue] = useState(false);
  const [expanded, setExpandedalue] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("false");
  const classes = useStyles();

  async function purchaseTicket() {
    setPurchaseLoadingValue(true);
    const deployedRaffle = new ethers.Contract(
      raffleAddress,
      RaffleContract.abi,
      signer
    );
    const ethTicketPrice = ethers.utils.parseEther(
      raffleTicketPrice.toString()
    );
    try {
      const purchaseTx = await deployedRaffle.purchaseTicket({
        from: userAddress,
        value: ethTicketPrice,
      });
      provider.once(purchaseTx.hash, (transaction) => {
        setPurchaseLoadingValue(false);
        getRaffles();
      });
    } catch (error) {
      setError(true);
      setErrorMessage(error.message);
      setPurchaseLoadingValue(false);
    }
  }

  async function distributeFunds() {
    setDistributeLoadingValue(true);
    const deployedRaffle = new ethers.Contract(
      raffleAddress,
      RaffleContract.abi,
      signer
    );
    try {
      const distributeTx = await deployedRaffle.distribute();
      provider.once(distributeTx.hash, (transaction) => {
        setDistributeLoadingValue(false);
        getRaffles();
      });
    } catch (error) {
      setError(true);
      setErrorMessage(error.message);
      setDistributeLoadingValue(false);
    }
  }

  const checkRaffleFilter = () => {
    if (raffleFilter === "open" && open) {
      return "block";
    } else if (raffleFilter === "closed" && open === false) {
      return "block";
    } else if (raffleFilter === "owned" && isOwner) {
      return "block";
    } else {
      return "none";
    }
  };

  return (
    <div className={classes.root} style={{ display: checkRaffleFilter() }}>
      <ErrorMessage
        error={error}
        errorMessage={errorMessage}
        setError={setError}
      />
      <Paper className={classes.paper} elevation={3}>
        <Grid
          container
          wrap="nowrap"
          spacing={1}
          className={!open ? "closed" : ""}
        >
          {open && raffleFilter === "open" ? (
            <Grid item xs={3}>
              <LoadingButton
                buttonText="Purchase Ticket"
                loading={purchaseLoading}
                onClickHandler={purchaseTicket}
                buttonType="purchase-ticket"
                userConnected={userConnected}
              />
            </Grid>
          ) : (
            ""
          )}
          {isOwner && open && raffleFilter === "owned" ? (
            <Grid item xs={3}>
              <LoadingButton
                buttonText="Distribute Funds"
                loading={distributeLoading}
                onClickHandler={distributeFunds}
                buttonType="distribute"
                userConnected={userConnected}
              />
            </Grid>
          ) : (
            ""
          )}
          <Grid item xs={10}>
            {!expanded && (
              <Typography variant="h6" noWrap gutterBottom>
                {description} | Balance: {balance} ETH
                <IconButton onClick={() => setExpandedalue(!expanded)}>
                  {expanded ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
              </Typography>
            )}
            {expanded && (
              <>
                <Typography variant="h6" noWrap gutterBottom>
                  {description} | Balance: {balance} ETH
                  <IconButton onClick={() => setExpandedalue(!expanded)}>
                    {expanded ? <ExpandLess /> : <ExpandMore />}
                  </IconButton>
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <div>Ticket Price: {raffleTicketPrice} ETH</div>
                  <div>TicketsOwned: {userTicketCount}</div>
                  <div>TicketCount: {totalTicketCount}</div>
                  Beneficiary:{" "}
                  <a
                    href={"https://rinkeby.etherscan.io/address/" + beneficiary}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {beneficiary.slice(0, 6) +
                      "..." +
                      beneficiary.slice(37, -1)}
                  </a>
                </Typography>
              </>
            )}
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
};

export default Raffle;
