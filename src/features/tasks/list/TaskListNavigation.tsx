import React, { useContext, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { RootStoreContext } from '../../../app/stores/rootStore';
import Spinner from '../../../app/layout/Spinner';

// Material UI
import { makeStyles, Theme, alpha } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    position: 'relative',
    width: '100%',
    minHeight: 250,
  },
  list: {
    backgroundColor: 'transparent',
    [theme.breakpoints.down('sm')]: {
      marginTop: theme.spacing(1),
    },
  },
  subheader: {
    fontSize: theme.typography.h6.fontSize,
    padding: theme.spacing(2),
    lineHeight: theme.typography.h6.lineHeight,
  },
  listItem: {
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.07),
    },
  },
  listItemActive: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    boxShadow: theme.shadows[5],
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
    },
  },
  listItemText: {
    fontSize: '1.4rem !important',
  },
  listItemActiveText: {
    fontWeight: 'bold',
  },
  value: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    padding: theme.spacing(0.5, 1.8),
    fontWeight: 'bold',
    borderRadius: theme.shape.borderRadius,
  },
  valueActive: {
    backgroundColor: theme.palette.secondary.main,
  },
}));

const TaskListNavigation = () => {
  const classes = useStyles();
  const rootStore = useContext(RootStoreContext);
  const {
    navigationItems,
    selectNavigationItem,
    loanStatus,
    userRole,
    getNavigationItems,
    navigationPending,
  } = rootStore.loanApplicationListStore;
  const { lang } = rootStore.commonStore;

  useEffect(() => {
    getNavigationItems();
  }, [getNavigationItems, lang]);

  return (
    <Paper className={classes.root}>
      {navigationPending ? (
        <Spinner />
      ) : (
        navigationItems.map((item, idx) => (
          <List
            key={idx}
            subheader={
              <ListSubheader className={classes.subheader}>
                {item.name}
              </ListSubheader>
            }
            className={classes.list}
          >
            {item.items.map((status, index) => (
              <ListItem
                key={index}
                className={classes.listItem}
                selected={
                  item.roleId === userRole && status.statusId === loanStatus
                }
                onClick={() =>
                  selectNavigationItem(item.roleId, status.statusId)
                }
              >
                <ListItemText
                  classes={{
                    primary: classes.listItemText,
                  }}
                  primary={status.name}
                />
                <ListItemSecondaryAction>
                  <Typography className={classes.value} variant="caption">
                    {status.value}
                  </Typography>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        ))
      )}
    </Paper>
  );
};

export default observer(TaskListNavigation);
