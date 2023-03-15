import ForgotPasswordFrom from './forms/ForgotPasswordForm';

// Material UI
import { makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexFlow: 'column nowrap',
    height: `calc(100vh - 64px)`,
  },
  title: {
    margin: theme.spacing(2, 0),
  },
}));

const ForgotPassword = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography variant="h6" className={classes.title}>
        Восстановление пароля
      </Typography>
      <ForgotPasswordFrom />
    </div>
  );
};

export default ForgotPassword;
