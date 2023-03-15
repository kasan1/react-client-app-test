import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import {
  ILoanApplicationDetails,
  LizingType,
} from '../../../app/models/loanApplication';
import TabPanel from '../../../app/common/tabs/TabPanel';
import ClientDetails from './tap-panel/ClientDetails';
import Assets from './tap-panel/Assets';
import ClientExtraDetails from './tap-panel/ClientExtraDetails';
import Contracts from './tap-panel/Contracts';
import Documents from './tap-panel/Documents';
import FinAnalysis from './tap-panel/FinAnalysis';

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

const TaskDetailsInfo: React.FC<IProps> = ({ loanApplication }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const [value, setValue] = useState(0);

  const handleChange = (_: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          scrollButtons="auto"
          aria-label="data types tabs"
          classes={{
            flexContainer: classes.tabs,
          }}
          centered
        >
          <Tab
            label={t('COMPONENTS.TASK_DETAILS_INFO.CLIENT_DATA')}
            {...a11yProps(0)}
          />
          <Tab
            label={
              loanApplication !== null &&
              loanApplication.application.loanType === LizingType.Express
                ? t('COMPONENTS.TASK_DETAILS_INFO.ASSETS')
                : t('COMPONENTS.TASK_DETAILS_INFO.CLIENT_EXTRA_DETAILS')
            }
            {...a11yProps(1)}
          />
          <Tab
            label={t('COMPONENTS.TASK_DETAILS_INFO.EQUIPMENT')}
            {...a11yProps(2)}
          />
          <Tab
            label={t('COMPONENTS.TASK_DETAILS_INFO.DOCUMENTS')}
            {...a11yProps(3)}
          />
          <Tab
            label={t('COMPONENTS.TASK_DETAILS_INFO.FIN_ANALYSIS')}
            {...a11yProps(3)}
          />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0} className={classes.tabPanel}>
        {loanApplication !== null && <ClientDetails data={loanApplication} />}
      </TabPanel>
      <TabPanel value={value} index={1} className={classes.tabPanel}>
        {loanApplication !== null &&
          (loanApplication.application.loanType === LizingType.Express ? (
            <Assets data={loanApplication.assets} />
          ) : (
            <ClientExtraDetails data={loanApplication.clientExtraDetails} />
          ))}
      </TabPanel>
      <TabPanel value={value} index={2} className={classes.tabPanel}>
        {loanApplication !== null && (
          <Contracts
            data={loanApplication.contracts}
            loanType={loanApplication.application.loanType}
          />
        )}
      </TabPanel>
      <TabPanel value={value} index={3} className={classes.tabPanel}>
        {loanApplication !== null && (
          <Documents data={loanApplication.documents} />
        )}
      </TabPanel>
      <TabPanel value={value} index={4} className={classes.tabPanel}>
        {loanApplication !== null && (
          <FinAnalysis data={loanApplication.finAnalysis} />
        )}
      </TabPanel>
    </div>
  );
};

export default observer(TaskDetailsInfo);
