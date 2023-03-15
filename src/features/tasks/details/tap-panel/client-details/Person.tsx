import React from 'react';
import { useTranslation } from 'react-i18next';
import { IPerson } from '../../../../../app/models/loanApplication';
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
  title: string;
  data: IPerson | undefined;
}

const Person: React.FC<IProps> = ({ title, data: person }) => {
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

  if (isEmpty(person) || !person) return null;

  return (
    <div>
      {renderTitle(title)}
      {renderLine(t('COMPONENTS.CLIENT_DETAILS.FULLNAME'), person.fullName)}
      {renderLine(t('COMPONENTS.CLIENT_DETAILS.CITIZENSHIP'), person.country)}
      {renderLine(t('COMPONENTS.CLIENT_DETAILS.IIN'), person.identifier)}
      {person.identificationDocument &&
        renderLine(
          t('COMPONENTS.CLIENT_DETAILS.PASSPORT'),
          `${person.identificationDocument.number}, ${
            person.identificationDocument.issuer
          }, ${format(
            new Date(person.identificationDocument.dateIssue),
            'dd.MM.yyyy',
          )}`,
        )}
      {renderLine(
        t('COMPONENTS.CLIENT_DETAILS.ADDRESS'),
        person.address?.register,
      )}
      {renderLine(
        t('COMPONENTS.CLIENT_DETAILS.WORK_PHONE_NUMBER'),
        person.phone.work,
      )}
      {renderLine(
        t('COMPONENTS.CLIENT_DETAILS.MOBILE_PHONE_NUMBER'),
        person.phone.mobile,
      )}
      {renderLine(
        t('COMPONENTS.CLIENT_DETAILS.HOME_PHONE_NUMBER'),
        person.phone.home,
      )}
      {renderLine(
        t('COMPONENTS.CLIENT_DETAILS.BIRTH_DATE'),
        format(new Date(person.birthDate), 'dd.MM.yyyy'),
      )}
      {renderLine(
        t('COMPONENTS.CLIENT_DETAILS.BIRTH_PLACE'),
        person.birthPlace,
      )}
      {renderLine(t('COMPONENTS.CLIENT_DETAILS.EDUCATION'), person.education)}
      {renderLine(
        t('COMPONENTS.CLIENT_DETAILS.WORK_EXPERIENCE_TOTAL'),
        person.workExperience?.total,
      )}
      {renderLine(
        t('COMPONENTS.CLIENT_DETAILS.WORK_EXPERIENCE_AGRICULTURE'),
        person.workExperience?.agriculture,
      )}
      {renderLine(
        t('COMPONENTS.CLIENT_DETAILS.MARRIAGE_STATUS'),
        person.marriageStatus,
      )}
      {renderLine(t('COMPONENTS.CLIENT_DETAILS.SPOUSE'), person.spouse)}
    </div>
  );
};

export default Person;
