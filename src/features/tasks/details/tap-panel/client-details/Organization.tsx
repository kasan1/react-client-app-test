import React from 'react';
import { useTranslation } from 'react-i18next';
import { IOrganization } from '../../../../../app/models/loanApplication';
import { isEmpty } from 'lodash';
import { format } from 'date-fns/esm';

// Material UI
import { makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme: Theme) => ({
  title: {
    fontWeight: 'bold',
    margin: theme.spacing(2, 0, 1),
    [theme.breakpoints.up('md')]: {
      fontSize: '1.8rem',
    },
  },
  fieldTitle: {
    fontWeight: 'bold',
    margin: theme.spacing(1),
  },
}));

interface IProps {
  data: IOrganization;
}

const Organization: React.FC<IProps> = ({ data: organization }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const renderTitle = (title: string) => (
    <Typography variant="h6" className={classes.title}>
      {title}
    </Typography>
  );

  const renderLine = (title: string, text?: string) => {
    if (isEmpty(text)) return null;

    return (
      <Typography>
        <span className={classes.fieldTitle}>{title}:</span>
        <span>{text}</span>
      </Typography>
    );
  };

  return (
    <div>
      {renderTitle(t('COMPONENTS.CLIENT_DETAILS.ORGANIZATION'))}
      {renderLine(
        t('COMPONENTS.CLIENT_DETAILS.ORGANIZATION_FULLNAME'),
        organization.fullName,
      )}
      {renderLine(
        t('COMPONENTS.CLIENT_DETAILS.REGISTER_ADDRESS'),
        organization.address?.register,
      )}
      {renderLine(
        t('COMPONENTS.CLIENT_DETAILS.FACT_ADDRESS'),
        organization.address?.fact,
      )}
      {renderLine(
        t('COMPONENTS.CLIENT_DETAILS.WORK_PHONE_NUMBER'),
        organization.phone?.work,
      )}
      {renderLine(
        t('COMPONENTS.CLIENT_DETAILS.MOBILE_PHONE_NUMBER'),
        organization.phone?.mobile,
      )}
      {renderLine(
        t('COMPONENTS.CLIENT_DETAILS.HOME_PHONE_NUMBER'),
        organization.phone?.home,
      )}
      {renderLine(t('COMPONENTS.CLIENT_DETAILS.FAX'), organization.fax)}
      {renderLine(t('COMPONENTS.CLIENT_DETAILS.EMAIL'), organization.email)}
      {renderLine(
        t('COMPONENTS.CLIENT_DETAILS.IIN_BIN'),
        organization.identifier,
      )}
      {renderLine(
        t('COMPONENTS.CLIENT_DETAILS.OKED'),
        organization.oked.join(', '),
      )}
      {renderLine(
        t('COMPONENTS.CLIENT_DETAILS.ORGANIZATION_TYPE'),
        organization.organizationType,
      )}
      {renderLine(
        t('COMPONENTS.CLIENT_DETAILS.OWNERSHIP_FORM'),
        organization.ownershipForm,
      )}
      {renderLine(
        t('COMPONENTS.CLIENT_DETAILS.PARENT_COMPANY'),
        organization.parent,
      )}
      {organization.identificationDocument &&
        renderLine(
          t('COMPONENTS.CLIENT_DETAILS.IDENTIFICATION_DOCUMENT'),
          `${organization.identificationDocument.number}, ${
            organization.identificationDocument.issuer
          }, 
          ${format(
            new Date(organization.identificationDocument.dateIssue),
            'dd.MM.yyyy',
          )}`,
        )}
      {organization.registrationDocument &&
        renderLine(
          t('COMPONENTS.CLIENT_DETAILS.REGISTRATION_DOCUMENT'),
          `${organization.registrationDocument.number}, ${
            organization.registrationDocument.issuer
          }, 
          ${format(
            new Date(organization.registrationDocument.dateIssue),
            'dd.MM.yyyy',
          )}`,
        )}
    </div>
  );
};

export default Organization;
