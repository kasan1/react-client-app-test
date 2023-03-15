import React, { useContext, Fragment, useEffect } from 'react';
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
import Typography from '@material-ui/core/Typography';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    position: 'relative',
    minHeight: 400,
  },
  listItem: {
    marginBottom: theme.spacing(1),
  },
  files: {
    marginBottom: theme.spacing(2),
  },
  fileListItem: {
    marginLeft: theme.spacing(2),
  },
}));

const ExpertiseResults = () => {
  const classes = useStyles();
  const rootStore = useContext(RootStoreContext);
  const { getExpertiseResults, expertiseResults, expertiseResultsLoading } =
    rootStore.loadApplicationDetailsStore;

  useEffect(() => {
    getExpertiseResults();
  }, [getExpertiseResults]);

  if (expertiseResultsLoading) {
    return <Spinner />;
  }

  if (expertiseResults.length === 0) {
    return <Typography variant="body1">Нет результатов</Typography>;
  }

  return (
    <div className={classes.root}>
      <List dense>
        {expertiseResults.map((result, idx) => (
          <Fragment key={idx}>
            <ListItem className={classes.listItem}>
              <ListItemText secondary={result.comment}>
                {result.roleName}
              </ListItemText>
            </ListItem>
            <List component="div" className={classes.files} disablePadding>
              {result.files.map((file, index) => (
                <ListItem key={index} button className={classes.fileListItem}>
                  <ListItemIcon>
                    <InsertDriveFileIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText>
                    <Link href={`/${file.url}`} download={file.filename}>
                      {file.filename}
                    </Link>
                  </ListItemText>
                </ListItem>
              ))}
            </List>
          </Fragment>
        ))}
      </List>
    </div>
  );
};

export default observer(ExpertiseResults);
