import { useHistory } from 'react-router-dom';
import { useEncodedQuery } from '../../app/hooks/useEncodedQuery';
import ResetPasswordFrom from './forms/ResetPasswordFrom';

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

interface IProps {
  title: string;
}

const ResetPassword: React.FC<IProps> = ({ title }) => {
  const classes = useStyles();
  const history = useHistory();
  const query = useEncodedQuery();

  const userName = query.get('username');
  const token = query.get('token');
  if (userName === null || token === null) {
    history.push('/');
  }

  return (
    <div className={classes.root}>
      <Typography variant="h6" className={classes.title}>
        {title}
      </Typography>
      <ResetPasswordFrom userName={userName!} token={token!} />
    </div>
  );
};

export default ResetPassword;
