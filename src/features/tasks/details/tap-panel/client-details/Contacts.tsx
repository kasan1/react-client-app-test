import React from 'react';
import { useTranslation } from 'react-i18next';
import { IPerson } from '../../../../../app/models/loanApplication';
import { isEmpty } from 'lodash';

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
  listItem: {
    margin: theme.spacing(1),
  },
}));

interface IProps {
  data: IPerson[];
}

const Contacts: React.FC<IProps> = ({ data: contacts }) => {
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

  if (contacts.length === 0) return null;

  return (
    <div>
      {renderTitle(t('COMPONENTS.CLIENT_DETAILS.CONTACTS'))}
      {contacts.map((contact, i) => (
        <div key={i} className={classes.listItem}>
          {renderLine(
            t('COMPONENTS.CLIENT_DETAILS.FULLNAME'),
            contact.fullName,
          )}
          {renderLine(
            t('COMPONENTS.CLIENT_DETAILS.REGISTER_ADDRESS'),
            contact.address?.register,
          )}
          {renderLine(
            t('COMPONENTS.CLIENT_DETAILS.PHONE'),
            contact.phone?.mobile,
          )}
        </div>
      ))}
    </div>
  );
};

export default Contacts;
