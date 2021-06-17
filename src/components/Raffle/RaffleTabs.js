import { useState } from "react";
import PropTypes from "prop-types";
import NewRaffle from "./NewRaffle";
import { makeStyles } from "@material-ui/core/styles";
import { Tabs, Tab, AppBar, Box } from "@material-ui/core";
import RaffleGroup from "./RaffleGroup";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: "90%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    flexWrap: "nowrap",
    alignContent: "center",
    margin: "auto",
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
      className="tabpanel"
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

  const handleChange = (event, newTab) => {
    setCurrentTabValue(newTab);
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
      <TabPanel currentTab={currentTab} index={0}>
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
        />
      </TabPanel>
      <TabPanel currentTab={currentTab} index={1}>
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
        />
      </TabPanel>
      <TabPanel currentTab={currentTab} index={2}>
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
        />
      </TabPanel>
      <TabPanel currentTab={currentTab} index={3}>
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
