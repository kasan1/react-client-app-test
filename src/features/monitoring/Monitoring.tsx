import MonitoringSearchForm from './forms/MonitoringSearchForm';

// Material UI
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  root: {},
}));

const Monitoring = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography variant="h5">
        Скачайте результат мониторинга за период
      </Typography>
      <MonitoringSearchForm />
    </div>
  );
};

export default Monitoring;
