import React from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import { ILoanApplicationDetails } from '../../../app/models/loanApplication';
import { format } from 'date-fns';

// Material UI
import { Theme, makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme: Theme) => ({
  title: {
    flexGrow: 1,
  },
  backBtn: {
    marginRight: theme.spacing(3) 
  }
}));

interface IProps {
  loanApplication: ILoanApplicationDetails | null;
}

const TaskDetailsToolbar: React.FC<IProps> = ({ loanApplication }) => {  
  const classes = useStyles();
  const { t } = useTranslation();
  const history = useHistory();

  const createdDate = loanApplication
    ? new Date(loanApplication.application.createdDate)
    : null;

  return (
    <Toolbar>
      <Button 
        className={classes.backBtn} 
        variant="outlined"
        onClick={() => history.goBack()}
      >
        {t('COMMON.BACK')}
      </Button>
      <Typography className={classes.title} color="inherit" variant="h5" component="div">
        {createdDate 
          ? t('COMPONENTS.TASK_DETAILS.TITLE').replace('{date}', format(createdDate!, 'dd.MM.yyyy'))
          : t('COMPONENTS.TASK_DETAILS.DEFAULT_TITLE')}
      </Typography>
    </Toolbar>
  )
}

export default TaskDetailsToolbar;
