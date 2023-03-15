import React from 'react';
import { useTranslation } from 'react-i18next';

// Material UI
import { makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme: Theme) => ({
  actions: {
    float: 'right',
    padding: theme.spacing(2, 0, 1)
  },
  btn: {
    margin: theme.spacing(0, 2)
  }
}))

interface IProps {
  text: string;
  onReject: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onAccept: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  acceptButtonDisabled?: boolean;
}

const ConfirmForm: React.FC<IProps> = ({ text, onReject, onAccept, acceptButtonDisabled }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <div>
      <Typography color="textSecondary">{text}</Typography>
      <div className={classes.actions}>
        <Button className={classes.btn} onClick={onReject} color="default" variant="contained">
          {t('COMMON.NO')}
        </Button>
        <Button 
          onClick={onAccept} 
          className={classes.btn} 
          color="primary" 
          variant="contained" 
          disabled={acceptButtonDisabled}
          autoFocus>
          {t('COMMON.YES')}
        </Button>
      </div>
    </div>
  )
}

export default ConfirmForm;
