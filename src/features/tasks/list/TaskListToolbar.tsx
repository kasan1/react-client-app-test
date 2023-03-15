import React, { FormEvent, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';
import { RootStoreContext } from '../../../app/stores/rootStore';

// Material UI
import { Theme, makeStyles, alpha } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';

const useStyles = makeStyles((theme: Theme) => ({
  title: {
    flexGrow: 1,
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.15),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  },
  searchIcon: {
    top: 0,
    right: 0,
    height: '100%',
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1.5, 2),
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '140px',
      '&:focus': {
        width: '200px',
      },
    },
  },
}));

const TaskListToolbar = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  const rootStore = useContext(RootStoreContext);
  const { search, handleSearchChange, getLoanApplications } =
    rootStore.loanApplicationListStore;

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await getLoanApplications();
  };

  return (
    <Toolbar>
      <Typography
        className={classes.title}
        color="inherit"
        variant="h5"
        component="div"
      >
        {t('COMPONENTS.TASKS_LIST.TITLE')}
      </Typography>
      <form className={classes.search} onSubmit={onSubmit}>
        <InputBase
          value={search}
          onChange={handleSearchChange}
          placeholder={`${t('COMPONENTS.TASKS_LIST.FULLNAME')}/${t(
            'COMPONENTS.TASKS_LIST.IIN',
          )}`}
          classes={{
            root: classes.inputRoot,
            input: classes.inputInput,
          }}
          inputProps={{ 'aria-label': 'search' }}
        />
        <IconButton type="submit" className={classes.searchIcon}>
          <SearchIcon />
        </IconButton>
      </form>
    </Toolbar>
  );
};

export default observer(TaskListToolbar);
