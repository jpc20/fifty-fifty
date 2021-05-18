import { Button, CircularProgress } from "@material-ui/core";

const LoadingButton = ({ buttonText, loading, onClickHandler, disabled }) => {
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
          disabled={disabled}
        >
          {buttonText}
        </Button>
      );
    }
  };

  return <div>{renderButton()}</div>;
};

export default LoadingButton;
