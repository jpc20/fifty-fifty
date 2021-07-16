import { useState } from "react";
import { ethers } from "ethers";
import RaffleContract from "../../artifacts/contracts/Raffle.sol/Raffle.json";
import RaffleFactory from "../../artifacts/contracts/RaffleFactory.sol/RaffleFactory.json";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Typography, Paper, IconButton, Button } from "@material-ui/core";
import { ExpandMore, ExpandLess, OpenInNew } from "@material-ui/icons";
import LoadingButton from "../LoadingButton";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: ".5rem",
  },
  paper: {
    margin: `${theme.spacing(1)}px auto`,
    padding: ".5rem",
    maxWidth: "95%",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      padding: "0.2rem",
    },
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
  isAdmin,
  open,
  raffleAddress,
  ticketsAddress,
  raffleFilter,
  getRaffles,
  signer,
  provider,
  userAddress,
  userConnected,
  setFlashActive,
  setFlashMessage,
  setFlashType,
  raffleFactoryAddress,
  distributeTx,
}) => {
  const [purchaseLoading, setPurchaseLoadingValue] = useState(false);
  const [distributeLoading, setDistributeLoadingValue] = useState(false);
  const [closeLoading, setCloseLoadingValue] = useState(false);
  const [expanded, setExpandedalue] = useState(false);
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
        setFlashMessage("Successfully purchased ticket!");
        setFlashType("success");
        setFlashActive(true);
      });
    } catch (error) {
      setFlashType("error");
      setFlashMessage(error.message);
      setFlashActive(true);
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
        setFlashMessage("Funds Distributed Successfully!");
        setFlashType("success");
        setFlashActive(true);
      });
    } catch (error) {
      setFlashType("error");
      setFlashMessage(error.message);
      setFlashActive(true);
      setDistributeLoadingValue(false);
    }
  }

  const checkRaffleFilter = () => {
    if (
      (raffleFilter === "open" && open) ||
      raffleFilter === "tickets" ||
      (raffleFilter === "owned" && isOwner)
    ) {
      return "block";
    } else {
      return "none";
    }
  };

  const closeRaffle = async () => {
    setCloseLoadingValue(true);
    const factory = new ethers.Contract(
      raffleFactoryAddress,
      RaffleFactory.abi,
      signer
    );
    try {
      const closedTx = await factory.closeRaffle(raffleAddress);
      provider.once(closedTx.hash, (transaction) => {
        setCloseLoadingValue(false);
        getRaffles();
        setFlashMessage("Closed Raffle");
        setFlashType("success");
        setFlashActive(true);
      });
    } catch (err) {
      setFlashType("error");
      setFlashMessage(err.error ? err.error.message : err.message);
      setFlashActive(true);
      setCloseLoadingValue(false);
    }
  };

  return (
    <div className={classes.root} style={{ display: checkRaffleFilter() }}>
      <Paper className={classes.paper} elevation={3}>
        <Grid container wrap="nowrap" spacing={1}>
          {open && raffleFilter === "open" ? (
            <Grid item xs>
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
          {raffleFilter === "tickets" && (
            <Grid item xs>
              <Typography variant="h6" noWrap gutterBottom>
                Tickets: {userTicketCount}
              </Typography>
            </Grid>
          )}
          {isOwner && raffleFilter === "owned" && (
            <Grid item xs>
              <LoadingButton
                buttonText="Distribute Funds"
                loading={distributeLoading}
                onClickHandler={distributeFunds}
                buttonType="distribute"
                userConnected={userConnected}
                disabled={totalTicketCount < 1 || !open}
              />
            </Grid>
          )}
          <Grid item xs={6}>
            <Typography variant="h6" noWrap>
              {description}
            </Typography>
            {open ? (
              <Typography variant="body1">Balance: {balance} ETH</Typography>
            ) : (
              <Typography variant="body1">
                {distributeTx[0] && (
                  <a
                    href={
                      "https://rinkeby.etherscan.io/tx/" +
                      distributeTx[0].transactionHash
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Winner:{" "}
                    {distributeTx.length > 0 &&
                      distributeTx[0].args[1].slice(0, 6) +
                        "..." +
                        distributeTx[0].args[1].slice(37, -1)}
                    {" Prize: Ξ"}
                    {ethers.utils.formatEther(distributeTx[0].args[2]) / 2}
                  </a>
                )}
              </Typography>
            )}
          </Grid>
          <Grid item xs>
            {open ? (
              <IconButton onClick={() => setExpandedalue(!expanded)}>
                {expanded ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            ) : (
              <Typography color="secondary">Closed</Typography>
            )}
          </Grid>
        </Grid>

        {expanded && open && (
          <Grid container direction="column">
            <Grid item>
              <Typography>Ticket Price: {raffleTicketPrice} ETH</Typography>
            </Grid>
            <Grid item>
              <Typography>Tickets You Own: {userTicketCount}</Typography>
            </Grid>
            <Grid item>
              <Typography>Total Ticket Supply: {totalTicketCount}</Typography>
            </Grid>
            <Grid item>
              <Typography>
                Percent Chance to Win:{" "}
                {100 * (userTicketCount / totalTicketCount).toFixed(4) || 0}%
              </Typography>
            </Grid>
            <Grid item>
              <Typography>
                Beneficiary:{" "}
                <a
                  href={"https://rinkeby.etherscan.io/address/" + beneficiary}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {beneficiary.slice(0, 6) + "..." + beneficiary.slice(37, -1)}
                </a>
              </Typography>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                color="primary"
                endIcon={<OpenInNew />}
                gutterBottom
              >
                <a
                  href={
                    "https://rinkeby.etherscan.io/" +
                    (raffleFilter === "tickets"
                      ? "token/" + ticketsAddress + "?a=" + userAddress
                      : "address/" + raffleAddress)
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Typography variant="button" display="block" gutterBottom>
                    View {raffleFilter === "tickets" ? "Tickets" : "Raffle"} On
                    Etherscan
                  </Typography>
                </a>
              </Button>
              {isAdmin && open && (
                <Grid item>
                  <LoadingButton
                    buttonText="Close Raffle"
                    loading={closeLoading}
                    onClickHandler={closeRaffle}
                    userConnected={userConnected}
                  ></LoadingButton>
                </Grid>
              )}
            </Grid>
          </Grid>
        )}
        {expanded && !open && <Typography>Winner: </Typography>}
      </Paper>
    </div>
  );
};

export default Raffle;
