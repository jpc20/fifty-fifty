import { Button, CircularProgress } from "@material-ui/core";

const LoadingButton = ({ buttonText, loading, onClickHandler }) => {
  const renderButton = () => {
    if (loading) {
      return (
        <Button>
          <CircularProgress />
        </Button>
      );
    } else {
      return (
        <Button
          type="submit"
          variant="contained"
          color="primary"
          onClick={onClickHandler}
        >
          {buttonText}
        </Button>
      );
    }
  };

  return <div>{renderButton()}</div>;
};

export default LoadingButton;
