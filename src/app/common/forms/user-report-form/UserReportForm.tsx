import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { RootStoreContext } from '../../../stores/rootStore';
import { IFormSettings } from '../../../models/loanApplication';
import UserReportFormActions from './UserReportFormActions';
import UserReportFormComments from './UserReportFormComments';

// Material UI
import { makeStyles, Theme } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

const useStyles = makeStyles((theme: Theme) => ({
  formControl: {
    width: '100%',
  },
  formLabel: {
    marginBottom: theme.spacing(2),
  },
  formGroupItem: {
    margin: theme.spacing(2, 0, 1),
  },
  formControlLabel: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
}));

interface IProps {
  settings: IFormSettings;
}

const UserReportForm: React.FC<IProps> = ({ settings }) => {
  const classes = useStyles();
  const rootStore = useContext(RootStoreContext);
  const { userReportFormValues, setUserReportFormCheckboxValue } =
    rootStore.loadApplicationDetailsStore;

  return (
    <div>
      <FormControl component="fieldset" className={classes.formControl}>
        {settings.fields.length > 0 && (
          <FormLabel className={classes.formLabel} component="legend">
            {settings.subtitle}
          </FormLabel>
        )}
        <FormGroup>
          {settings.fields.map((field, idx) => (
            <div key={idx} className={classes.formGroupItem}>
              <FormControlLabel
                className={classes.formControlLabel}
                control={
                  <Checkbox
                    checked={userReportFormValues[settings.id].fields[field.id]}
                    color="primary"
                    disabled={settings.isReadOnly}
                    onChange={(_, val) =>
                      setUserReportFormCheckboxValue(settings.id, field.id, val)
                    }
                  />
                }
                label={field.name}
                labelPlacement="start"
              />
              <UserReportFormComments
                formId={settings.id}
                field={field}
                isReadOnly={settings.isReadOnly}
              />
            </div>
          ))}
        </FormGroup>
      </FormControl>
      {!settings.isReadOnly && (
        <UserReportFormActions
          formId={settings.id}
          buttons={settings.buttons}
        />
      )}
    </div>
  );
};

export default observer(UserReportForm);
