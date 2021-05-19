import { useState } from "react";
import { ethers } from "ethers";
import RaffleContract from "../../artifacts/contracts/Raffle.sol/Raffle.json";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Typography, Paper } from "@material-ui/core";
import LoadingButton from "../LoadingButton";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    overflow: "hidden",
    padding: theme.spacing(0, 3),
  },
  paper: {
    margin: `${theme.spacing(1)}px auto`,
    padding: theme.spacing(2),
    maxWidth: "80%",
  },
}));

const Raffle = ({
  raffleTicketPrice,
  beneficiary,
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
}) => {
  const [purchaseLoading, setPurchaseLoadingValue] = useState(false);
  const [distributeLoading, setDistributeLoadingValue] = useState(false);
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
      console.log(error);
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
      console.log(error);
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
      <Paper className={classes.paper}>
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
              />
            </Grid>
          ) : (
            ""
          )}
          <Grid item xs={10}>
            <Typography variant="h6" noWrap>
              Ticket Price: {raffleTicketPrice} ETH, Balance: {balance} ETH,
              TicketsOwned: {userTicketCount}, TicketCount: {totalTicketCount},
              {/* Beneficiary: {beneficiary.slice(0, 4)}... */}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
};

export default Raffle;
