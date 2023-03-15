import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { RootStoreContext } from '../../../app/stores/rootStore';
import { IChangePasswordFormValues } from '../../../app/models/user';
import passwordValidationScheme from '../../../app/validators/passwordValidationScheme';
import InputField from '../../../app/common/inputs/InputField';

import { makeStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Alert from '@material-ui/lab/Alert';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(1),
    display: 'flex',
    flexFlow: 'column wrap',
    justifyContent: 'center',
    width: 500,
  },
  input: {
    minWidth: 300,
    marginBottom: theme.spacing(1),
  },
  helperText: {
    color: 'red',
  },
  submitButton: {
    marginBottom: theme.spacing(2),
  },
  alert: {
    width: '100%',
    margin: `-${theme.spacing(2)}px 0 ${theme.spacing(2)}px`,
  },
}));

interface IProps {
  callback: () => void;
}

const ChangePassword: React.FC<IProps> = ({ callback }) => {
  const rootStore = useContext(RootStoreContext);
  const { changePassword, pending } = rootStore.userStore;

  const classes = useStyles();
  const { t } = useTranslation();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { handleSubmit, control, errors } = useForm<IChangePasswordFormValues>({
    resolver: yupResolver(passwordValidationScheme),
    reValidateMode: 'onBlur',
    mode: 'onBlur',
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      await changePassword(data);
      callback();
    } catch (ex) {
      // @ts-ignore
      if (ex && 'Message' in ex) setErrorMessage(ex.Message);
    }
  });

  return (
    <form className={classes.root} onSubmit={onSubmit}>
      <InputField
        name="oldPassword"
        type="password"
        label={t('COMPONENTS.CHANGE_PASSWORD.OLD_PASSWORD')}
        control={control}
        error={errors?.oldPassword?.message ?? ' '}
        className={classes.input}
        fullWidth
      />
      <InputField
        name="newPassword"
        type="password"
        label={t('COMPONENTS.CHANGE_PASSWORD.NEW_PASSWORD')}
        control={control}
        error={errors?.newPassword?.message ?? ' '}
        className={classes.input}
        fullWidth
      />
      <InputField
        name="confirmedNewPassword"
        type="password"
        label={t('COMPONENTS.CHANGE_PASSWORD.CONFIRMED_NEW_PASSWORD')}
        control={control}
        error={errors?.confirmedNewPassword?.message ?? ' '}
        className={classes.input}
        fullWidth
      />
      {errorMessage && (
        <Alert className={classes.alert} severity="error">
          {errorMessage}
        </Alert>
      )}
      <Button
        color="primary"
        variant="outlined"
        type="submit"
        size="large"
        className={classes.submitButton}
        disabled={Object.keys(errors).length > 0 || pending}
      >
        {t('COMMON.SAVE')}
      </Button>
    </form>
  );
};

export default ChangePassword;
