import { useState, useEffect } from "react";
import { ethers } from "ethers";
import RaffleContract from "../../artifacts/contracts/Raffle.sol/Raffle.json";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Grid, Typography, Paper } from "@material-ui/core";
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

const Raffle = ({ raffleAddress, getSignerAndProvider, raffleFilter }) => {
  const [beneficiary, setBeneficiaryValue] = useState("");
  const [balance, setBalanceValue] = useState(0);
  const [userTicketCount, setUserTicketCountValue] = useState(0);
  const [totalTicketCount, setTotalTicketCountValue] = useState(0);
  const [raffleTicketPrice, setRaffleTickerPriceValue] = useState(0);
  const [isOwner, setIsOwnerValue] = useState(false);
  const [open, setOpenValue] = useState(null);
  const [purchaseLoading, setPurchaseLoadingValue] = useState(false);
  const [distributeLoading, setDistributeLoadingValue] = useState(false);
  const classes = useStyles();

  useEffect(() => {
    const getRaffle = async () => {
      const [provider, signer, address] = await getSignerAndProvider();
      const deployedRaffle = new ethers.Contract(
        raffleAddress,
        RaffleContract.abi,
        signer
      );
      const raffleTicketPrice = await deployedRaffle.ticketPrice();
      const raffleBeneficiary = await deployedRaffle.beneficiary();
      const userTickets = await deployedRaffle.ticketCount(address);
      const allTicketHolders = await deployedRaffle.getTicketHolders();
      const contractBalance = await provider.getBalance(raffleAddress);
      const checkOwner = await deployedRaffle.owner();
      const openStatus = await deployedRaffle.open();
      setRaffleTickerPriceValue(
        ethers.utils.formatEther(raffleTicketPrice.toString())
      );
      setUserTicketCountValue(userTickets.toNumber());
      setTotalTicketCountValue(allTicketHolders.length);
      setBeneficiaryValue(raffleBeneficiary);
      setBalanceValue(ethers.utils.formatEther(contractBalance.toString()));
      setOpenValue(openStatus);
      setIsOwnerValue(checkOwner === address);
    };
    getRaffle();
  }, []);

  async function purchaseTicket() {
    setPurchaseLoadingValue(true);
    const [provider, signer, address] = await getSignerAndProvider();
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
        from: address,
        value: ethTicketPrice,
      });
      provider.once(purchaseTx.hash, (transaction) => {
        setUserTicketCountValue((userTicketCount) => userTicketCount + 1);
        setPurchaseLoadingValue(false);
        setBalanceValue(parseFloat(balance) + parseFloat(raffleTicketPrice));
      });
    } catch (error) {
      console.log(error);
      setPurchaseLoadingValue(false);
    }
  }

  async function distributeFunds() {
    setDistributeLoadingValue(true);
    const [provider, signer, address] = await getSignerAndProvider();
    const deployedRaffle = new ethers.Contract(
      raffleAddress,
      RaffleContract.abi,
      signer
    );
    try {
      const distributeTx = await deployedRaffle.distribute();
      provider.once(distributeTx.hash, (transaction) => {
        setDistributeLoadingValue(false);
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
