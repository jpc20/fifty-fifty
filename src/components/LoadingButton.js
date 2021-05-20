import { Button, CircularProgress } from "@material-ui/core";
import { AccountBalance } from "@material-ui/icons";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import ReceiptSharpIcon from "@material-ui/icons/ReceiptSharp";

const LoadingButton = ({
  buttonText,
  loading,
  onClickHandler,
  disabled,
  variant,
  buttonType
}) => {
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
          variant={variant || "contained"}
          color="primary"
          onClick={onClickHandler}
          disabled={disabled}
        >
          {buttonType === 'account' && (
            <AccountCircleIcon fontSize="small" />
          )}
          {buttonType === 'purchase-ticket' && (
            <ReceiptSharpIcon fontSize="small" />
          )}
          {buttonType === 'distribute' && (
            <AccountBalance fontSize="small" />
          )}
          {buttonText}
        </Button>
      );
    }
  };

  return <div>{renderButton()}</div>;
};

export default LoadingButton;
