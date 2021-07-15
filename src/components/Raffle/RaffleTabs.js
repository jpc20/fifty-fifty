import { useState } from "react";
import PropTypes from "prop-types";
import NewRaffle from "./NewRaffle";
import { makeStyles } from "@material-ui/core/styles";
import {
  Tabs,
  Tab,
  AppBar,
  Box,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
} from "@material-ui/core";
import RaffleGroup from "./RaffleGroup";

const useStyles = makeStyles((theme) => ({
  appbar: {
    flexGrow: 1,
    width: "90%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    flexWrap: "nowrap",
    alignContent: "center",
    margin: "auto",
    [theme.breakpoints.down("sm")]: {
      width: "auto",
      padding: "0",
    },
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
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

const RaffleTabs = ({
  raffles,
  raffleFactoryAddress,
  getRaffles,
  signer,
  provider,
  userAddress,
  userConnected,
  setFlashActive,
  setFlashMessage,
  setFlashType,
}) => {
  const classes = useStyles();
  const [currentTab, setCurrentTabValue] = useState(0);
  const [filter, setFilter] = useState("open");
  const [sortValue, setSortValue] = useState("balance");
  const [sortOpen, setSortOpen] = useState(false);

  const handleTabChange = (event, newTab) => {
    setCurrentTabValue(newTab);
  };

  const handleSortChange = (event) => {
    setSortValue(event.target.value);
  };

  const handleSortClose = () => {
    setSortOpen(false);
  };

  const handleSortOpen = () => {
    setSortOpen(true);
  };

  return (
    <div>
      <AppBar position="static" className={classes.appbar}>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          aria-label="raffle-tabs"
          centered
        >
          <Tab
            label="Open Raffles"
            {...a11yProps(0)}
            onClick={() => setFilter("open")}
          />
          <Tab
            label="Your Tickets"
            {...a11yProps(1)}
            onClick={() => setFilter("tickets")}
          />
          <Tab
            label="Your Raffles"
            {...a11yProps(2)}
            onClick={() => setFilter("owned")}
          />
          <Tab label="Create New Raffle" {...a11yProps(3)} />
        </Tabs>
      </AppBar>
      <FormControl className={classes.formControl}>
        <InputLabel id="controlled-open-select-label">Sort By</InputLabel>
        <Select
          labelId="controlled-open-select-label"
          id="controlled-open-select"
          open={sortOpen}
          onClose={handleSortClose}
          onOpen={handleSortOpen}
          value={sortValue}
          onChange={handleSortChange}
        >
          <MenuItem value={"balance"}>Balance (High to Low)</MenuItem>
          <MenuItem value={"balanceReverse"}>Balance (Low to High)</MenuItem>
        </Select>
      </FormControl>
      <TabPanel currentTab={currentTab} index={0} className="tabpanel">
        <RaffleGroup
          filter={filter}
          raffles={raffles}
          getRaffles={getRaffles}
          signer={signer}
          provider={provider}
          userAddress={userAddress}
          userConnected={userConnected}
          setFlashActive={setFlashActive}
          setFlashMessage={setFlashMessage}
          setFlashType={setFlashType}
          raffleFactoryAddress={raffleFactoryAddress}
          sortBy={sortValue}
        />
      </TabPanel>
      <TabPanel currentTab={currentTab} index={1} className="tabpanel">
        <RaffleGroup
          filter={filter}
          raffles={raffles}
          getRaffles={getRaffles}
          signer={signer}
          provider={provider}
          userAddress={userAddress}
          userConnected={userConnected}
          setFlashActive={setFlashActive}
          setFlashMessage={setFlashMessage}
          setFlashType={setFlashType}
          sortBy={sortValue}
        />
      </TabPanel>
      <TabPanel currentTab={currentTab} index={2} className="tabpanel">
        <RaffleGroup
          filter={filter}
          raffles={raffles}
          getRaffles={getRaffles}
          signer={signer}
          provider={provider}
          userAddress={userAddress}
          userConnected={userConnected}
          setFlashActive={setFlashActive}
          setFlashMessage={setFlashMessage}
          setFlashType={setFlashType}
          sortBy={sortValue}
        />
      </TabPanel>
      <TabPanel currentTab={currentTab} index={3} className="tabpanel">
        <NewRaffle
          raffleFactoryAddress={raffleFactoryAddress}
          setCurrentTabValue={setCurrentTabValue}
          setFilter={setFilter}
          getRaffles={getRaffles}
          signer={signer}
          provider={provider}
          userAddress={userAddress}
          userConnected={userConnected}
          setFlashActive={setFlashActive}
          setFlashMessage={setFlashMessage}
          setFlashType={setFlashType}
        />
      </TabPanel>
    </div>
  );
};

export default RaffleTabs;
