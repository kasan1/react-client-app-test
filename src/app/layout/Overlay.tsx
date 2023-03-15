import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { makeStyles } from '@material-ui/core/styles';
import Backdrop from '@material-ui/core/Backdrop';
import { RootStoreContext } from '../stores/rootStore';

const useStyles = makeStyles(theme => ({
  root: {
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor: 'rgba(0, 0, 0, .5)'
  }
}))

const Overlay = () => {
  const rootStore = useContext(RootStoreContext);
  const { overlayOpen, setOverlayOpenState } = rootStore.commonStore;
  const classes = useStyles();

  return (
    <Backdrop className={classes.root} open={overlayOpen} onClick={() => setOverlayOpenState(false)}></Backdrop>
  )
}

export default observer(Overlay);
