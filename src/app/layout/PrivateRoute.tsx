import React, { useContext } from 'react';
import {
  Route,
  Redirect,
  RouteComponentProps,
  RouteProps,
} from 'react-router-dom';
import { UserRole } from '../models/user';
import { RootStoreContext } from '../stores/rootStore';

interface IProps extends RouteProps {
  component: React.ComponentType<RouteComponentProps<any>>;
  roles?: UserRole[];
}

const PrivateRoute: React.FC<IProps> = ({
  component: Component,
  roles = [],
  ...rest
}) => {
  const rootStore = useContext(RootStoreContext);
  const { isLoggedIn, isInRole } = rootStore.userStore;

  let rolesCheckPassed = true;
  if (roles.length > 0) {
    rolesCheckPassed = roles.some((r) => isInRole(r));
  }

  return (
    <Route
      {...rest}
      render={(props) =>
        isLoggedIn && rolesCheckPassed ? (
          <Component {...props} />
        ) : (
          <Redirect to="/" />
        )
      }
    />
  );
};

export default PrivateRoute;
