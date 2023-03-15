import React from 'react';
import { useTranslation } from 'react-i18next';

// Material UI
import { makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    flexFlow: 'row nowrap',
    justifyContent: 'center',
    alignItems: 'center',
    height: `calc(100vh - 64px - ${theme.spacing(2) * 2}px)`
  },
  statusCode: {
    fontSize: '5em',
    fontWeight: 'bold'
  },
  divider: {
    height: 80,
    width: 3,
    display: 'block',
    backgroundColor: '#bbb',
    margin: theme.spacing(0, 4)
  },
  text: {
    fontSize: '3em'
  }
}));

const NotFound = () => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <div className={classes.root}>
      <Typography className={classes.statusCode}>404</Typography>
      <span className={classes.divider}></span>
      <Typography className={classes.text}>{t('COMPONENTS.NOT_FOUND.TEXT')}</Typography>
    </div>
  )
}

export default NotFound;
