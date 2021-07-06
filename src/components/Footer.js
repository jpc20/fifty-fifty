import { AppBar, Toolbar } from "@material-ui/core";
import { GitHub, LinkedIn, Twitter } from "@material-ui/icons";
import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  appBar: {
    top: "auto",
    bottom: 0,
  },
  clickableIcon: {
    cursor: "pointer",
    margin: "1rem",
  },
}));
const Footer = () => {
  const classes = useStyles();

  return (
    <>
      <AppBar position="fixed" className={classes.appBar} color="primary">
        <Toolbar>
          <Typography variant="subtitle1" gutterBottom>
            Built by @jpc20
          </Typography>
          <GitHub
            onClick={(event) =>
              (window.location.href = "https://github.com/jpc20")
            }
            className={classes.clickableIcon}
          />
          <LinkedIn
            onClick={(event) =>
              (window.location.href =
                "https://www.linkedin.com/in/jack-cullen-/")
            }
            className={classes.clickableIcon}
          />
          <Twitter
            onClick={(event) =>
              (window.location.href = "https://twitter.com/jpcullen20")
            }
            className={classes.clickableIcon}
          />
        </Toolbar>
      </AppBar>
      <Toolbar />
    </>
  );
};

export default Footer;
