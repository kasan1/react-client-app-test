import ImportCheckingListForm from './forms/ImportCheckingListForm';

// Material UI
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  root: {},
}));

const ImportCheckingList = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography variant="h5">Загрузка списков для проверки</Typography>
      <ImportCheckingListForm />
    </div>
  );
};

export default ImportCheckingList;
