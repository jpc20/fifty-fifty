import { useState } from "react";
import PropTypes from "prop-types";
import Raffle from "./Raffle";
import NewRaffle from "./NewRaffle";
import { makeStyles } from "@material-ui/core/styles";
import { Tabs, Tab, AppBar, Box, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`wrapped-tabpanel-${index}`}
      aria-labelledby={`wrapped-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `raffle-tab-${index}`,
    "aria-controls": `raffle-tabpanel-${index}`,
  };
}

const RaffleTabs = ({ raffles, getSignerAndProvider, raffleFactoryAddress }) => {
  const classes = useStyles();
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const raffleComponents = (raffleFilter) => {
    return raffles.map((raffleAddress) => {
      return (
        <Raffle
          raffleAddress={raffleAddress}
          key={raffleAddress}
          getSignerAndProvider={getSignerAndProvider}
          raffleFilter={raffleFilter}
        />
      );
    });
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="raffle-tabs"
          centered
        >
          <Tab label="Open Raffles" {...a11yProps(0)} />
          <Tab label="Closed Raffles" {...a11yProps(1)} />
          <Tab label="Your Raffles" {...a11yProps(2)} />
          <Tab label="Create New Raffle" {...a11yProps(3)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        {raffleComponents("open")}
      </TabPanel>
      <TabPanel value={value} index={1}>
        {raffleComponents("closed")}
      </TabPanel>
      <TabPanel value={value} index={2}>
        {raffleComponents("owned")}
      </TabPanel>
      <TabPanel value={value} index={3}>
        <NewRaffle
          raffleFactoryAddress={raffleFactoryAddress}
          getSignerAndProvider={getSignerAndProvider}
        />
      </TabPanel>
    </div>
  );
};

export default RaffleTabs;
