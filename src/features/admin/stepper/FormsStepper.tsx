import { useState, useCallback, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';
import { RootStoreContext } from '../../../app/stores/rootStore';
import { IRegisterFormValues } from '../../../app/models/user';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import userRegisterValidationSchemee from '../../../app/validators/userRegisterValidationScheme';
import UserPersonalDataForm from '../forms/UserProfileForm';
import UserBranchesForm from '../forms/UserBranсhesForm';
import UserRolesForm from '../forms/UserRolesForm';

// Material UI
import { makeStyles, Theme } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Alert from '@material-ui/lab/Alert';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: 600,
  },
  contentContainer: {
    margin: theme.spacing(2),
  },
  navigationButtons: {
    margin: theme.spacing(0, 2),
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  prevButton: {
    marginLeft: theme.spacing(2),
  },
  completeContainer: {
    padding: theme.spacing(3),
  },
  alert: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
}));

interface IProps {
  formValues: IRegisterFormValues;
  onComplete: () => void;
}

const FormsStepper: React.FC<IProps> = ({ onComplete, formValues }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const [activeStep, setActiveStep] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const rootStore = useContext(RootStoreContext);
  const { registerUser, registerFormIsPending } = rootStore.adminStore;

  const { handleSubmit, control, errors, trigger } =
    useForm<IRegisterFormValues>({
      resolver: yupResolver(userRegisterValidationSchemee),
      reValidateMode: 'onBlur',
      mode: 'onBlur',
      shouldUnregister: false,
      defaultValues: formValues,
    });

  const onSubmit = handleSubmit(async (data) => {
    try {
      setErrorMessage(null);
      await registerUser(data);
      onComplete();
    } catch (ex) {
      // @ts-ignore
      if (ex && 'Message' in ex) setErrorMessage(ex.Message);
    }
  });

  const handleNext = useCallback(async () => {
    const isValid = await trigger();

    if (!isValid) return;

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  }, [trigger]);

  const handlePrev = useCallback(async () => {
    const isValid = await trigger();

    if (!isValid) return;

    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  }, [trigger]);

  const getSteps = useCallback(() => {
    return [
      {
        labelCode: 'PERSONAL_DATA',
        component: <UserPersonalDataForm control={control} errors={errors} />,
      },
      {
        labelCode: 'BRANCHES_AND_POSITIONS',
        component: (
          <UserBranchesForm
            control={control}
            trigger={trigger}
            errors={errors}
          />
        ),
      },
      {
        labelCode: 'ROLES',
        component: <UserRolesForm control={control} errors={errors} />,
      },
    ];
  }, [errors, control, trigger]);

  const steps = getSteps();

  return (
    <form className={classes.root} onSubmit={onSubmit}>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((step) => (
          <Step key={step.labelCode}>
            <StepLabel>
              {t(`COMPONENTS.ADMIN.STEPPER.${step.labelCode}`)}
            </StepLabel>
            <StepContent>
              <div className={classes.contentContainer}>{step.component}</div>
              <div className={classes.navigationButtons}>
                <Button
                  size="large"
                  className={classes.button}
                  disabled={activeStep === 0 || Object.keys(errors).length > 0}
                  onClick={() => handlePrev()}
                >
                  {t('COMMON.BACK')}
                </Button>
                <Button
                  color="primary"
                  variant="outlined"
                  size="large"
                  className={classes.button}
                  disabled={Object.keys(errors).length > 0}
                  onClick={() => handleNext()}
                >
                  {t('COMMON.CONTINUE')}
                </Button>
              </div>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length && (
        <Paper square elevation={0} className={classes.completeContainer}>
          {errorMessage && (
            <Alert className={classes.alert} severity="error">
              {errorMessage}
            </Alert>
          )}
          {Object.keys(errors).length === 0 && (
            <Typography>
              {t(`COMPONENTS.ADMIN.STEPPER.SUCCEED_MESSAGE`)}
            </Typography>
          )}
          <div>
            <Button
              size="large"
              className={classes.button}
              onClick={() => handlePrev()}
              disabled={registerFormIsPending}
            >
              {t('COMMON.BACK')}
            </Button>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              className={classes.button}
              disabled={Object.keys(errors).length > 0 || registerFormIsPending}
            >
              {t('COMMON.FINISH')}
            </Button>
          </div>
        </Paper>
      )}
    </form>
  );
};

export default observer(FormsStepper);
