import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';
import { Link as RouterLink } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import InputMask from 'react-input-mask';
import { RootStoreContext } from '../../../app/stores/rootStore';
import { ILoginFormValues } from '../../../app/models/user';
import loginValidationScheme from '../../../app/validators/loginValidationScheme';

// Material UI
import { makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Alert from '@material-ui/lab/Alert';
import Link from '@material-ui/core/Link';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    flexFlow: 'column nowrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: 300,
    marginBottom: 15,
  },
  input: {
    margin: theme.spacing(1, 0),
  },
  alert: {
    width: '100%',
    margin: theme.spacing(1, 0),
  },
  helperText: {
    color: 'red',
  },
  link: {
    display: 'block',
    margin: theme.spacing(1, 0),
  },
}));

const LoginForm: React.FC = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  const [error, setError] = useState<string | null>(null);

  const rootStore = useContext(RootStoreContext);
  const { login, pending, setLoginModalOpenState } = rootStore.userStore;
  const { handleSubmit, control, errors } = useForm<ILoginFormValues>({
    resolver: yupResolver(loginValidationScheme),
    reValidateMode: 'onBlur',
    mode: 'onBlur',
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      await login(data).finally(() => setError(null));
    } catch (ex) {
      // @ts-ignore
      if (ex && 'Message' in ex) setError(ex.Message);
    }
  });

  return (
    <form className={classes.root} onSubmit={onSubmit}>
      <Controller
        name="login"
        control={control}
        defaultValue=""
        render={({ value, onChange, onBlur }) => (
          <InputMask
            mask="999999999999"
            value={value}
            onChange={onChange}
            onBlur={onBlur}
          >
            {(inputProps: any) => (
              <TextField
                {...inputProps}
                label={t('COMMON.IIN')}
                helperText={errors?.login?.message}
                className={classes.input}
                FormHelperTextProps={{
                  className: classes.helperText,
                }}
                variant="outlined"
                fullWidth
              />
            )}
          </InputMask>
        )}
      />
      <Controller
        name="password"
        control={control}
        defaultValue=""
        render={({ value, onChange, onBlur }) => (
          <TextField
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            type="password"
            label={t('COMMON.PASSWORD')}
            helperText={errors?.password?.message}
            className={classes.input}
            FormHelperTextProps={{
              className: classes.helperText,
            }}
            variant="outlined"
            fullWidth
          />
        )}
      />
      <RouterLink to={`/password/restore`}>
        <Link
          className={classes.link}
          onClick={() => setLoginModalOpenState(false)}
        >
          Забыл пароль
        </Link>
      </RouterLink>
      {error && (
        <Alert className={classes.alert} severity="error">
          {error}
        </Alert>
      )}
      <Button
        type="submit"
        variant="contained"
        color="primary"
        className={classes.input}
        disabled={pending}
      >
        {t('COMPONENTS.TOP_BAR.LOGIN_BUTTON')}
      </Button>
    </form>
  );
};

export default observer(LoginForm);
