import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';
import { RootStoreContext } from '../../../app/stores/rootStore';
import { createDownloadLink, getFilename } from '../../../app/utils/utils';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { IMonitoringSearchFormValues } from '../../../app/models/monitoring';
import monitoringValidationScheme from '../../../app/validators/monitoringValidationScheme';
import InputField from '../../../app/common/inputs/InputField';
import DateField from '../../../app/common/inputs/DateField';

// Material UI
import { makeStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Alert from '@material-ui/lab/Alert';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: '100%',
  },
  formContainer: {
    maxWidth: 900,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    margin: theme.spacing(3, 0),
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  alert: {
    width: '100%',
    margin: theme.spacing(2, 0),
  },
  helperText: {
    color: 'red',
  },
}));

const MonitoringSearchForm = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const rootStore = useContext(RootStoreContext);
  const { loading, getReport } = rootStore.monitoringStore;

  const { handleSubmit, control, errors, reset } =
    useForm<IMonitoringSearchFormValues>({
      resolver: yupResolver(monitoringValidationScheme),
      reValidateMode: 'onBlur',
      mode: 'onBlur',
      defaultValues: {
        identifier: '',
        dateFrom: new Date(),
        dateTo: new Date(),
      },
    });

  const onSubmit = handleSubmit(async (data) => {
    try {
      setErrorMessage(null);

      const response = await getReport(data);

      if (!!response) {
        createDownloadLink(response, getFilename(response));

        reset();
      }
    } catch (ex) {
      // @ts-ignore
      if (ex && 'Message' in ex) {
        // @ts-ignore
        setErrorMessage(ex.Message);
      }
    }
  });

  return (
    <form onSubmit={onSubmit}>
      <div>
        {errorMessage && (
          <Alert className={classes.alert} severity="error">
            {errorMessage}
          </Alert>
        )}
      </div>
      <div className={classes.formContainer}>
        <InputField
          name="identifier"
          control={control}
          label={t('COMMON.IIN')}
          mask="999999999999"
          error={errors?.identifier?.message}
        />
        <DateField
          name="dateFrom"
          control={control}
          label={t('COMPONENTS.MONITORING.DATE_FROM')}
          error={errors?.dateFrom?.message}
        />
        <DateField
          name="dateTo"
          control={control}
          label={t('COMPONENTS.MONITORING.DATE_TO')}
          error={errors?.dateTo?.message}
        />
        <div>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            className={classes.button}
            disabled={Object.keys(errors).length > 0 || loading}
          >
            {t('COMPONENTS.MONITORING.DOWNLOAD')}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default observer(MonitoringSearchForm);
