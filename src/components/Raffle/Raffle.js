import { useState, useEffect } from "react";
import { ethers } from "ethers";
import RaffleContract from "../../artifacts/contracts/Raffle.sol/Raffle.json";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Grid, Typography, Paper } from "@material-ui/core";

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

const Raffle = ({ raffleAddress, getSignerAndProvider }) => {
  const [beneficiary, setBeneficiaryValue] = useState("");
  const [balance, setBalanceValue] = useState(0);
  const [userTicketCount, setUserTicketCountValue] = useState(0);
  const [raffleTicketPrice, setRaffleTickerPriceValue] = useState(0);
  const [isOwner, setIsOwnerValue] = useState(false);
  const [open, setOpenValue] = useState(true);
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
      const ticketCount = await deployedRaffle.ticketCount(address);
      const contractBalance = await provider.getBalance(raffleAddress);
      const checkOwner = await deployedRaffle.owner();
      const openStatus = await deployedRaffle.open();
      setRaffleTickerPriceValue(
        ethers.utils.formatEther(raffleTicketPrice.toString())
      );
      setUserTicketCountValue(ticketCount.toNumber());
      setBeneficiaryValue(raffleBeneficiary);
      setBalanceValue(ethers.utils.formatEther(contractBalance.toString()));
      setOpenValue(openStatus);
      setIsOwnerValue(checkOwner === address);
    };
    getRaffle();
  }, [getSignerAndProvider, raffleAddress, userTicketCount, balance]);

  async function purchaseTicket() {
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
        setUserTicketCountValue(userTicketCount + 1);
      });
    } catch (error) {
      console.log(error);
    }
  }

  async function distributeFunds() {
    const [provider, signer, address] = await getSignerAndProvider();
    const deployedRaffle = new ethers.Contract(
      raffleAddress,
      RaffleContract.abi,
      signer
    );
    try {
      await deployedRaffle.distribute();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Grid
          container
          wrap="nowrap"
          spacing={1}
          className={!open ? "closed" : ""}
        >
          {open && (
            <Grid item xs={3}>
              <Button
                variant="contained"
                color="primary"
                onClick={purchaseTicket}
              >
                Purchase Ticket
              </Button>
            </Grid>
          )}
          {isOwner && open && (
            <Grid item xs={3}>
              <Button
                variant="contained"
                color="primary"
                onClick={distributeFunds}
              >
                Distribute Funds
              </Button>
            </Grid>
          )}
          <Grid item xs={10}>
            <Typography variant="h6" noWrap >
              Ticket Price: {raffleTicketPrice} ETH, Balance: {balance} ETH,
              TicketsOwned: {userTicketCount}
              {/* Beneficiary: {beneficiary.slice(0, 10)}... */}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
};

export default Raffle;
