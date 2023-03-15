import React, { useContext, Fragment, useEffect, useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import { RootStoreContext } from '../../../../app/stores/rootStore';
import Spinner from '../../../../app/layout/Spinner';

// Material UI
import { makeStyles, Theme } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    position: 'relative',
    minHeight: 400,
  },
  listItem: {
    marginBottom: theme.spacing(1),
  },
}));

const CreditCommitteeResults = () => {
  const classes = useStyles();
  const rootStore = useContext(RootStoreContext);

  const {
    getCreditCommitteeResults,
    creditCommitteeResults,
    creditCommitteeResultsLoading,
    loanApplication,
  } = rootStore.loadApplicationDetailsStore;

  useEffect(() => {
    getCreditCommitteeResults();
  }, [getCreditCommitteeResults]);

  const isProtocolReady = useMemo(() => {
    switch (loanApplication?.application.status) {
      case 'AfterCommittee':
      case 'CreditAdmin':
      case 'Completed':
        return true;
      default:
        return false;
    }
  }, [loanApplication]);

  return (
    <div className={classes.root}>
      {creditCommitteeResultsLoading ? (
        <Spinner />
      ) : (
        <List dense>
          {creditCommitteeResults.map((result, idx) => (
            <Fragment key={idx}>
              <ListItem className={classes.listItem}>
                <ListItemText secondary={result.comment}>
                  {result.userName}
                </ListItemText>
              </ListItem>
            </Fragment>
          ))}
          {isProtocolReady && (
            <ListItem button className={classes.listItem}>
              <ListItemIcon>
                <InsertDriveFileIcon color="primary" />
              </ListItemIcon>
              <ListItemText>
                <Link
                  href={`/api/wordreports/minutesOfCreditCommitteeMeeting/${
                    loanApplication!.application.loanApplicationId
                  }`}
                  target="_blank"
                >
                  Протокол кредитного комитета
                </Link>
              </ListItemText>
            </ListItem>
          )}
        </List>
      )}
    </div>
  );
};

export default observer(CreditCommitteeResults);
