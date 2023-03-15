import { useContext } from 'react';
import clsx from 'clsx';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { RootStoreContext } from '../stores/rootStore';
import { UserRole } from '../models/user';

// Material components
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Link from '@material-ui/core/Link';
import Divider from '@material-ui/core/Divider';

import AssignmentIcon from '@material-ui/icons/Assignment';
import PersonIcon from '@material-ui/icons/Person';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import SecurityIcon from '@material-ui/icons/Security';
import ImportExportIcon from '@material-ui/icons/ImportExport';
import ComputerIcon from '@material-ui/icons/Computer';

// Styles
const useStyles = makeStyles((theme) => ({
  root: {
    width: 250,
  },
  list: {
    margin: `${theme.spacing(5)}px 0`,
  },
  listItem: {},
  listItemActive: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white,
    },
  },
  listItemIconActive: {
    color: theme.palette.common.white,
  },
  divider: {
    margin: `${theme.spacing(2)}px ${theme.spacing(1)}px`,
  },
}));

const Sidebar = () => {
  const classes = useStyles();
  const location = useLocation();
  const { t } = useTranslation();
  const rootStore = useContext(RootStoreContext);
  const { sideBarOpen, setSidebarOpenState } = rootStore.commonStore;
  const { logout, isInRole } = rootStore.userStore;

  const menuItems = [
    {
      to: '/tasklist',
      text: t('COMPONENTS.SIDE_BAR.TASKS_LIST'),
      icon: <AssignmentIcon />,
    },
    {
      to: '/profile',
      text: t('COMPONENTS.SIDE_BAR.PROFILE'),
      icon: <PersonIcon />,
    },
    {
      to: '/monitoring',
      text: t('COMPONENTS.SIDE_BAR.MONITORING'),
      icon: <ComputerIcon />,
    },
  ];

  if (isInRole(UserRole.Admin)) {
    menuItems.push({
      to: '/admin',
      text: t('COMPONENTS.SIDE_BAR.ADMIN'),
      icon: <SecurityIcon />,
    });
  }

  if (isInRole(UserRole.Admin) || isInRole(UserRole.ComplianceManager)) {
    menuItems.push({
      to: '/import/checking',
      text: t('COMPONENTS.SIDE_BAR.IMPORT'),
      icon: <ImportExportIcon />,
    });
  }

  return (
    <Drawer open={sideBarOpen} onClose={() => setSidebarOpenState(false)}>
      <div className={classes.root}>
        <List className={classes.list}>
          {menuItems.map((item, idx) => (
            <Link
              key={idx}
              to={item.to}
              component={RouterLink}
              color="inherit"
              underline="none"
            >
              <ListItem
                className={clsx(classes.listItem, {
                  [classes.listItemActive]: location.pathname === item.to,
                })}
                button
                key={item.to}
                onClick={() => setSidebarOpenState(false)}
              >
                <ListItemIcon
                  className={clsx({
                    [classes.listItemIconActive]: location.pathname === item.to,
                  })}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            </Link>
          ))}
          <Divider className={classes.divider} />
          <ListItem
            className={classes.listItem}
            button
            onClick={() => logout()}
          >
            <ListItemIcon>
              <ExitToAppIcon />
            </ListItemIcon>
            <ListItemText primary={t('COMMON.EXIT')} />
          </ListItem>
        </List>
      </div>
    </Drawer>
  );
};

export default observer(Sidebar);
