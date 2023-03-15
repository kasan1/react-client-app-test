import React from 'react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { IFinAnalysis, VerificationStatus } from '../../../../app/models/loanApplication';

// Material UI
import { makeStyles, Theme } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import CheckIcon from '@material-ui/icons/Check';
import RemoveIcon from '@material-ui/icons/Remove';
import NotInterestedIcon from '@material-ui/icons/NotInterested';

const useStyles = makeStyles((theme: Theme) => ({
  title: {
    fontWeight: 'bold',
  },
  resultsList: {
    marginTop: theme.spacing(2)
  },
  result: {
    marginLeft: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  list: {
    display: 'flex',
    flexFlow: 'row wrap',
    margin: 0
  },
  listItem: {
    width: 360
  },
  success: {
    color: green[500]
  }
}));

interface IProps {
  data: IFinAnalysis;
}

const FinAnalysis: React.FC<IProps> = ({ data }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  if (data == null)
    return null;

  
  const renderIcon = (status: VerificationStatus | null) => {
    switch(status) {
      case VerificationStatus.Correct:
        return <CheckIcon className={classes.success} />;
      case VerificationStatus.Critical:
      case VerificationStatus.Minor:
        return <RemoveIcon color="error" />
      case VerificationStatus.ServiceUnavailable:
        return <NotInterestedIcon color="action" />
      default:
        return null;
    }
  }

  return (
    <div>
      <Typography className={classes.title}>
        {t('COMPONENTS.FIN_ANALYSIS.DATE_OF_INSPECTION')}: <Typography component="span">{format(new Date(data.dateOfInspection), 'dd-MM-yyyy')}</Typography>
      </Typography>
      <Typography className={classes.title}>
        {t('COMPONENTS.FIN_ANALYSIS.OVERALL_STATUS')}: <Typography component="span">{data.overallStatus}</Typography>
      </Typography>
      <div className={classes.resultsList}>
        {data.results.map((result, index) => (
          <div className={classes.result} key={index}>
            <Typography className={classes.title}>{result.blockName}</Typography>
            <List className={classes.list}>
              {result.subjects.map((subject, idx) => (
                <ListItem key={idx} className={classes.listItem}>
                  <ListItemText primary={subject.name} secondary={subject.statusName} />
                  <ListItemIcon>
                    {renderIcon(subject.status)}
                  </ListItemIcon>
                </ListItem>
              ))}
            </List>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FinAnalysis;
