import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import {
  IFormSettings,
  ILoanApplicationDetails,
} from '../../../app/models/loanApplication';
import TabPanel from '../../../app/common/tabs/TabPanel';
import UserReportForm from '../../../app/common/forms/user-report-form/UserReportForm';
import ExpertiseResults from './tap-panel/ExpertiseResults';
import CreditCommitteeResult from './tap-panel/CreditCommitteeResults';
import Spinner from '../../../app/layout/Spinner';

// Material UI
import { makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

function a11yProps(index: any) {
  return {
    id: `scrollable-auto-tab-${index}`,
    'aria-controls': `scrollable-auto-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    flexGrow: 1,
  },
  appBar: {
    backgroundColor: theme.palette.background.paper,
  },
  tabs: {
    backgroundColor: theme.palette.background.paper,
  },
  tabPanel: {
    height: 'calc(100vh - 200px)',
    overflowY: 'auto',
    padding: theme.spacing(2),
  },
}));

interface IProps {
  loanApplication: ILoanApplicationDetails | null;
}

const TaskDetailsForm: React.FC<IProps> = ({ loanApplication }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const [value, setValue] = useState(0);

  const handleChange = (_: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  const renderTabs = (forms: IFormSettings[]) =>
    forms.map((form, idx) => (
      <Tab key={idx} label={form.title} {...a11yProps(idx)} />
    ));

  const renderForms = (forms: IFormSettings[]) =>
    forms.map((form, idx) => (
      <TabPanel
        key={idx}
        value={value}
        index={idx}
        className={classes.tabPanel}
      >
        <UserReportForm settings={form} />
      </TabPanel>
    ));

  if (loanApplication === null) return <Spinner />;

  return (
    <div className={classes.root}>
      <AppBar position="static" color="default" className={classes.appBar}>
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="desktop"
          aria-label="data types tabs"
          classes={{
            flexContainer: classes.tabs,
          }}
        >
          {renderTabs(loanApplication.forms)}
          <Tab
            label={t('COMPONENTS.TASK_DETAILS_FORM.EXPERTISE')}
            {...a11yProps(loanApplication.forms.length)}
          />
          <Tab
            label={t('COMPONENTS.TASK_DETAILS_FORM.CREDIT_COMMITTEE')}
            {...a11yProps(loanApplication.forms.length + 1)}
          />
        </Tabs>
      </AppBar>
      {renderForms(loanApplication.forms)}
      <TabPanel
        value={value}
        index={loanApplication.forms.length}
        className={classes.tabPanel}
      >
        <ExpertiseResults />
      </TabPanel>
      <TabPanel
        value={value}
        index={loanApplication.forms.length + 1}
        className={classes.tabPanel}
      >
        <CreditCommitteeResult />
      </TabPanel>
    </div>
  );
};

export default observer(TaskDetailsForm);
