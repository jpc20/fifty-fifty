import { makeStyles } from "@material-ui/core/styles";
import MuiAlert from "@material-ui/lab/Alert";
import { Snackbar } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
}));

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const FlashMessage = ({ active, flashMessage, setActive, type }) => {
  const classes = useStyles();

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setActive(false);
  };
  return (
    <div className={classes.root}>
      <Snackbar
        open={active}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        autoHideDuration={9000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity={type}>
          {flashMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default FlashMessage;
