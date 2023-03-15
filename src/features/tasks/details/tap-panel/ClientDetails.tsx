import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ICreditHistory,
  ILoanApplicationDetails,
  IOrganization,
} from '../../../../app/models/loanApplication';
import UniversalTable from '../../../../app/common/tables/UniversalTable';
import { ITableData, ITableHeader } from '../../../../app/models/common';
import Person from './client-details/Person';
import Organization from './client-details/Organization';
import Contacts from './client-details/Contacts';
import BankAccounts from './client-details/BankAccounts';
import { format } from 'date-fns';

// Material UI
import { makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  title: {
    fontWeight: 'bold',
    margin: theme.spacing(2, 0, 1),
    [theme.breakpoints.up('md')]: {
      fontSize: '1.8rem',
    },
  },
  table: {
    margin: theme.spacing(3, 0),
  },
  pkb: {
    margin: theme.spacing(2, 0),
  },
}));

interface IProps {
  data: ILoanApplicationDetails;
}

const ClientDetails: React.FC<IProps> = ({
  data: { clientDetails, application },
}) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const generateCreditHistoryTableData = (
    creditHistory: ICreditHistory[],
  ): ITableData => {
    const header: ITableHeader[] = [
      {
        code: 'fullName',
        name: t('COMPONENTS.CLIENT_DETAILS.CREDIT_ORGANIZATION_FULLNAME'),
        isOrderBy: true,
        orderByDirection: 'asc',
      },
      {
        code: 'sum',
        name: t('COMPONENTS.CLIENT_DETAILS.CREDIT_SUM'),
        isOrderBy: false,
        orderByDirection: 'asc',
      },
      {
        code: 'dateIssue',
        name: t('COMPONENTS.CLIENT_DETAILS.CREDIT_ISSUE_DATE'),
        isOrderBy: false,
        orderByDirection: 'asc',
      },
      {
        code: 'period',
        name: t('COMPONENTS.CLIENT_DETAILS.CREDIT_PERIOD'),
        isOrderBy: false,
        orderByDirection: 'asc',
      },
      {
        code: 'balance',
        name: t('COMPONENTS.CLIENT_DETAILS.CREDIT_BALANCE'),
        isOrderBy: false,
        orderByDirection: 'asc',
      },
    ];

    return {
      header,
      body: creditHistory.map((ch) => ({
        ...ch,
        dateIssue: format(new Date(ch.dateIssue), 'dd.MM.yyyy'),
      })),
    };
  };

  const generateAffiliatedCompaniesTableData = (
    organizations: IOrganization[],
  ): ITableData => {
    const header: ITableHeader[] = [
      {
        code: 'fullName',
        name: t('COMPONENTS.CLIENT_DETAILS.AFFILIATED_ORGANIZATION_FULLNAME'),
        isOrderBy: true,
        orderByDirection: 'asc',
      },
      {
        code: 'bank_accounts',
        name: t(
          'COMPONENTS.CLIENT_DETAILS.AFFILIATED_ORGANIZATION_BANK_ACCOUNTS',
        ),
        isOrderBy: false,
        orderByDirection: 'asc',
      },
      {
        code: 'share_in_company',
        name: t(
          'COMPONENTS.CLIENT_DETAILS.AFFILIATED_ORGANIZATION_SHARE_IN_COMPANY',
        ),
        isOrderBy: false,
        orderByDirection: 'asc',
      },
      {
        code: 'debts',
        name: t('COMPONENTS.CLIENT_DETAILS.AFFILIATED_ORGANIZATION_DEBT_SUM'),
        isOrderBy: false,
        orderByDirection: 'asc',
      },
    ];

    return {
      header,
      body: organizations.map((org) => ({
        fullName: `${org.fullName}, ${org.address?.register}`,
        bank_accounts: org.bankAccounts
          .map((ba) => `БИК: ${ba.bic}, счет: ${ba.number}`)
          .join('; '),
        share_in_company: org.shareInCapital,
        debts: org.debts
          .map((d) => `БИК: ${d.bic}, cумма: ${d.debt}`)
          .join('; '),
      })),
    };
  };

  return (
    <Grid container className={classes.root}>
      <Grid item xs={12} sm={6}>
        <Organization data={clientDetails.organization} />
        <Person
          title={t('COMPONENTS.CLIENT_DETAILS.BENEFICIARY')}
          data={clientDetails.beneficiary}
        />
        <Person
          title={t('COMPONENTS.CLIENT_DETAILS.REPRESENTATIVE')}
          data={clientDetails.representative}
        />
        <Contacts data={clientDetails.contacts} />
        <BankAccounts data={clientDetails.organization.bankAccounts} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <Person
          title={t('COMPONENTS.CLIENT_DETAILS.HEAD')}
          data={clientDetails.head}
        />
        <Person
          title={t('COMPONENTS.CLIENT_DETAILS.BOOKER')}
          data={clientDetails.booker}
        />
      </Grid>
      <Grid item xs={12}>
        <div className={classes.table}>
          <UniversalTable
            title={t('COMPONENTS.CLIENT_DETAILS.CREDIT_HISTORY')}
            data={generateCreditHistoryTableData(
              clientDetails.organization.creditHistory,
            )}
          />
        </div>
      </Grid>
      <Grid item xs={12}>
        <div className={classes.table}>
          <UniversalTable
            title={t('COMPONENTS.CLIENT_DETAILS.AFFILIATED_ORGANIZATIONS')}
            data={generateAffiliatedCompaniesTableData(
              clientDetails.organization.affiliatedOrganizations,
            )}
          />
        </div>
      </Grid>
      {application.pkbFile && (
        <Grid item xs={12} className={classes.pkb}>
          <Typography variant="h6" className={classes.title}>
            Файл из ПКБ:
          </Typography>
          <Link
            href={`/${application.pkbFile.url}`}
            download={application.pkbFile.filename}
          >
            {application.pkbFile.filename}
          </Link>
        </Grid>
      )}
    </Grid>
  );
};

export default ClientDetails;
