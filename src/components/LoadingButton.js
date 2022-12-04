import { Button, CircularProgress } from '@material-ui/core';
import { AccountBalance, ReceiptSharp, OpenInNew } from '@material-ui/icons';

const LoadingButton = ({
  buttonText,
  loading,
  onClickHandler,
  userConnected,
  variant,
  buttonType,
  disabled,
}) => {
  if (loading) {
    return (
      <Button>
        <CircularProgress />
      </Button>
    );
  }
  return (
    <Button
      type="submit"
      variant={variant || 'contained'}
      color={buttonType === 'account' ? 'inherit' : 'primary'}
      onClick={onClickHandler}
      disabled={
        disabled ? disabled : buttonType !== 'account' && !userConnected
      }
      size="small"
    >
      {buttonType === 'purchase-ticket' && <ReceiptSharp fontSize="small" />}
      {buttonType === 'distribute' && <AccountBalance fontSize="small" />}
      {buttonText}
      {buttonType === 'account' && <OpenInNew fontSize="small" />}
    </Button>
  );
};

export default LoadingButton;
