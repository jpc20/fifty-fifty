import { Button, CircularProgress } from "@material-ui/core";
import { AccountBalance, AccountCircle, ReceiptSharp } from "@material-ui/icons";

const LoadingButton = ({
  buttonText,
  loading,
  onClickHandler,
  userConnected,
  variant,
  buttonType,
  disabled
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
          color={buttonType === "account" ? "inherit" : "primary"}
          onClick={onClickHandler}
          disabled={disabled ? disabled : buttonType !== "account" && !userConnected }
          size="small"
        >
          {buttonType === "account" && <AccountCircle fontSize="small" />}
          {buttonType === "purchase-ticket" && (
            <ReceiptSharp fontSize="small" />
          )}
          {buttonType === "distribute" && <AccountBalance fontSize="small" />}
          {buttonText}
        </Button>
      );
    }
  };

  return <div>{renderButton()}</div>;
};

export default LoadingButton;
