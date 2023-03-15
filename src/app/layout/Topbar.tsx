import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

// Icons
import MenuIcon from '@material-ui/icons/Menu';
import LanguageIcon from '@material-ui/icons/Language';

import { Lang } from '../models/common';
import { RootStoreContext } from '../stores/rootStore';
import UniversalDialog from '../common/dialogs/UniversalDialog';
import LoginForm from '../../features/user/forms/LoginForm';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    langButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  }),
);

const Topbar = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  const rootStore = useContext(RootStoreContext);
  const { setSidebarOpenState, setLanguage } = rootStore.commonStore;
  const { loginModalOpen, setLoginModalOpenState, isLoggedIn } =
    rootStore.userStore;
  const { fullname } = rootStore.profileStore;

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const handleLangMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLangMenuSelect = (lang: Lang) => {
    setLanguage(lang);
    setAnchorEl(null);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          {isLoggedIn && (
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="menu"
              onClick={() => setSidebarOpenState(true)}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" className={classes.title}>
            {t('TITLE')}
          </Typography>

          <IconButton
            color="inherit"
            className={classes.langButton}
            onClick={handleLangMenuOpen}
          >
            <LanguageIcon />
          </IconButton>
          <Menu
            id="lang-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
          >
            <MenuItem onClick={() => handleLangMenuSelect(Lang.kk)}>
              Қаз
            </MenuItem>
            <MenuItem onClick={() => handleLangMenuSelect(Lang.ru)}>
              Рус
            </MenuItem>
          </Menu>

          {isLoggedIn ? (
            <Typography>{fullname}</Typography>
          ) : (
            <Button
              onClick={() => setLoginModalOpenState(true)}
              color="inherit"
            >
              {t('COMPONENTS.TOP_BAR.LOGIN_BUTTON')}
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <UniversalDialog
        open={loginModalOpen}
        onClose={() => setLoginModalOpenState(false)}
        title={t('COMPONENTS.TOP_BAR.LOGIN_MODAL_TITLE')}
        content={<LoginForm />}
      />
    </div>
  );
};

export default observer(Topbar);
