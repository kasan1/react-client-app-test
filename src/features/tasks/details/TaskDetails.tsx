import React, { useEffect, useContext, Fragment } from 'react';
import { observer } from 'mobx-react-lite';
import { useParams } from "react-router-dom";
import TaskDetailsToolbar from './TaskDetailsToolbar';
import TaskDetailsInfo from './TaskDetailsInfo';
import TaskDetailsForm from './TaskDetailsForm';
import Spinner from '../../../app/layout/Spinner';
import { RootStoreContext } from '../../../app/stores/rootStore';

// Material UI
import { makeStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    minHeight: `90vh`
  }
}))

interface TParams { 
  loanApplicationTaskId: string;
};

const TaskDetails = () => {
  const classes = useStyles();
  const { loanApplicationTaskId } = useParams<TParams>();
  const rootStore = useContext(RootStoreContext);
  const { setLoanApplicationTaskId, getLoanApplicationDetails, detailsAreLoading, loanApplication } = rootStore.loadApplicationDetailsStore;

  useEffect(() => {
    setLoanApplicationTaskId(loanApplicationTaskId);
    getLoanApplicationDetails(loanApplicationTaskId);
  }, [setLoanApplicationTaskId, getLoanApplicationDetails, loanApplicationTaskId]);

  return (
    <div className={classes.root}>
      {detailsAreLoading 
        ? <Spinner />
        : (
          <Fragment>
            <TaskDetailsToolbar loanApplication={loanApplication} />
            <Grid container spacing={2}>
              <Grid item md={8}>
                <TaskDetailsInfo loanApplication={loanApplication} />
              </Grid>
              <Grid item md={4}>
                <TaskDetailsForm loanApplication={loanApplication} />
              </Grid>
            </Grid>
          </Fragment>
        )}      
    </div>
  )
}

export default observer(TaskDetails);
