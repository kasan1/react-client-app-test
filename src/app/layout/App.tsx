import { useContext, useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import { observer } from 'mobx-react-lite';

import CssBaseline from '@material-ui/core/CssBaseline';
import {
  MuiThemeProvider,
  createTheme,
  makeStyles,
  Theme,
} from '@material-ui/core/styles';
import { lightTheme, darkTheme } from '../config/theme';
import { RootStoreContext } from '../stores/rootStore';
import { ruRU } from '@material-ui/core/locale';
import { IJwt, UserRole } from '../models/user';

import { ToastContainer } from 'react-toastify';
import { Theme as MyTheme } from '../models/common';
import PrivateRoute from './PrivateRoute';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import Overlay from './Overlay';
import Spinner from './Spinner';
import NotFound from './NotFound';
import TaskList from '../../features/tasks/list/TaskList';
import Profile from '../../features/user/Profile';
import TaskDetails from '../../features/tasks/details/TaskDetails';
import AdminPanel from '../../features/admin/AdminPanel';
import ResetPassword from '../../features/user/ResetPassword';
import ForgotPassword from '../../features/user/ForgotPassword';
import ImportCheckingList from '../../features/import/ImportCheckingList';
import Monitoring from '../../features/monitoring/Monitoring';

const useStyles = makeStyles((theme: Theme) => ({
  app: {
    position: 'relative',
    padding: `${theme.spacing(2)}px`,
  },
  '@global': {
    '*::-webkit-scrollbar': {
      width: '0.4em',
      height: '0.4em',
    },
    '*::-webkit-scrollbar-track': {
      '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.00)',
    },
    '*::-webkit-scrollbar-thumb': {
      backgroundColor: 'rgba(0,0,0,.1)',
      outline: '1px solid #ccc',
    },
  },
}));

const App = () => {
  const rootStore = useContext(RootStoreContext);
  const { theme, setAppLoaded, access_token, refresh_token, appLoaded } =
    rootStore.commonStore;
  const { refreshToken, setUserFromToken, isLoggedIn } = rootStore.userStore;
  const { profile, loadProfile } = rootStore.profileStore;
  const classes = useStyles();

  useEffect(() => {
    const fetch = async () => {
      if (access_token && refresh_token) {
        const decoded = jwt_decode<IJwt>(access_token);
        const currentTime = Date.now() / 1000;

        if (decoded.exp > currentTime) {
          setUserFromToken(access_token);
        } else {
          await refreshToken();
        }

        if (isLoggedIn && profile === null) {
          await loadProfile();
        }
      }
      setAppLoaded();
    };

    fetch();
  }, [
    access_token,
    refresh_token,
    refreshToken,
    setAppLoaded,
    setUserFromToken,
    profile,
    isLoggedIn,
    loadProfile,
  ]);

  if (!appLoaded) return <Spinner />;

  return (
    <MuiThemeProvider
      theme={createTheme(theme === MyTheme.dark ? darkTheme : lightTheme, ruRU)}
    >
      <CssBaseline />
      <ToastContainer position="bottom-right" />
      <Topbar />
      <Switch>
        <PrivateRoute path="/" component={Sidebar} />
      </Switch>
      <div className={classes.app}>
        <Switch>
          <Route path="/password/restore">
            <ForgotPassword />
          </Route>
          <Route path="/password/set">
            <ResetPassword title="Установить пароль" />
          </Route>
          <Route path="/password/reset">
            <ResetPassword title="Сбросить пароль" />
          </Route>
          <Route exact path="/not-found" component={NotFound} />
          <PrivateRoute exact path="/profile" component={Profile} />
          <PrivateRoute exact path="/tasklist" component={TaskList} />
          <PrivateRoute
            exact
            path="/tasklist/:loanApplicationTaskId"
            component={TaskDetails}
          />
          <PrivateRoute
            exact
            path="/admin"
            component={AdminPanel}
            roles={[UserRole.Admin]}
          />
          <PrivateRoute
            exact
            path="/import/checking"
            component={ImportCheckingList}
            roles={[UserRole.Admin, UserRole.ComplianceManager]}
          />
          <PrivateRoute exact path="/monitoring" component={Monitoring} />
        </Switch>
      </div>
      <Overlay />
    </MuiThemeProvider>
  );
};

export default observer(App);
