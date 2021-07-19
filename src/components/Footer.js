import { AppBar, Toolbar } from "@material-ui/core";
import { GitHub, LinkedIn, Twitter } from "@material-ui/icons";
import { Typography, Link } from "@material-ui/core";
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
            <Link
              href="https://jackcullen.xyz/"
              target="_blank"
              rel="noopener"
              color="inherit"
            >
              Built by @jpc20
            </Link>
          </Typography>
          <GitHub
            onClick={(event) =>
              window.open("https://github.com/jpc20", "_blank")
            }
            className={classes.clickableIcon + " githubButton"}
          />
          <LinkedIn
            onClick={(event) => {
              window.open(
                "https://www.linkedin.com/in/jack-cullen-/",
                "_blank"
              );
            }}
            className={classes.clickableIcon + " linkedInButton"}
          />
          <Twitter
            onClick={(event) =>
              window.open("https://twitter.com/jpcullen20", "_blank")
            }
            className={classes.clickableIcon + " twitterButton"}
          />
        </Toolbar>
      </AppBar>
      <Toolbar />
    </>
  );
};

export default Footer;
