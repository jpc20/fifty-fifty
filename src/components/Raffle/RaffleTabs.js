import { useState } from "react";
import PropTypes from "prop-types";
import Raffle from "./Raffle";
import NewRaffle from "./NewRaffle";
import { makeStyles } from "@material-ui/core/styles";
import { Tabs, Tab, AppBar, Box } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

function TabPanel(props) {
  const { children, currentTab, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={currentTab !== index}
      id={`wrapped-tabpanel-${index}`}
      aria-labelledby={`wrapped-tab-${index}`}
      {...other}
    >
      {currentTab === index && (
        <Box p={3}>
          <div>{children}</div>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  currentTab: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `raffle-tab-${index}`,
    "aria-controls": `raffle-tabpanel-${index}`,
  };
}

const FILTER_MAP = {
  open: (raffle) => raffle.openStatus,
  closed: (raffle) => !raffle.openStatus,
  owned: (raffle) => raffle.owner,
};

const FILTER_NAMES = Object.keys(FILTER_MAP);

const RaffleTabs = ({
  raffles,
  getSignerAndProvider,
  raffleFactoryAddress,
}) => {
  const classes = useStyles();
  const [currentTab, setCurrentTabValue] = useState(0);
  const [filter, setFilter] = useState("open");

  const handleChange = (event, newTab) => {
    setCurrentTabValue(newTab);
  };

  const RaffleComponents = ({ raffles, filter }) => {
    const filtered = raffles.filter(FILTER_MAP[filter]).map((raffle) => {
      return (
        <Raffle
          getSignerAndProvider={getSignerAndProvider}
          raffleTicketPrice={raffle.ticketPrice}
          beneficiary={raffle.beneficiary}
          userTicketCount={raffle.userTicketCount}
          totalTicketCount={raffle.totalTicketCount}
          balance={raffle.balance}
          isOwner={raffle.owner}
          open={raffle.openStatus}
          raffleAddress={raffle.raffleAddress}
          key={raffle.raffleAddress}
          raffleFilter={filter}
        />
      );
    });
    return filtered;
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Tabs
          value={currentTab}
          onChange={handleChange}
          aria-label="raffle-tabs"
          centered
        >
          <Tab
            label="Open Raffles"
            {...a11yProps(0)}
            onClick={() => setFilter("open")}
          />
          <Tab
            label="Closed Raffles"
            {...a11yProps(1)}
            onClick={() => setFilter("closed")}
          />
          <Tab
            label="Your Raffles"
            {...a11yProps(2)}
            onClick={() => setFilter("owned")}
          />
          <Tab label="Create New Raffle" {...a11yProps(3)} />
        </Tabs>
      </AppBar>
      <TabPanel currentTab={currentTab} index={0}>
        <RaffleComponents filter={filter} raffles={raffles} />
      </TabPanel>
      <TabPanel currentTab={currentTab} index={1}>
        <RaffleComponents filter={filter} raffles={raffles} />
      </TabPanel>
      <TabPanel currentTab={currentTab} index={2}>
        <RaffleComponents filter={filter} raffles={raffles} />
      </TabPanel>
      <TabPanel currentTab={currentTab} index={3}>
        <NewRaffle
          raffleFactoryAddress={raffleFactoryAddress}
          getSignerAndProvider={getSignerAndProvider}
          setCurrentTabValue={setCurrentTabValue}
        />
      </TabPanel>
    </div>
  );
};

export default RaffleTabs;
