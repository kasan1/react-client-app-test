import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { IResetPasswordFormValues } from '../../../app/models/user';
import { RootStoreContext } from '../../../app/stores/rootStore';
import forgotPasswordValidationScheme from '../../../app/validators/forgotPasswordValidationScheme';
import InputField from '../../../app/common/inputs/InputField';

// Material UI
import { makeStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: 400,
  },
  button: {
    margin: '0 auto',
    display: 'block',
  },
}));

const ForgotPasswordForm = () => {
  const classes = useStyles();
  const { t } = useTranslation();

  const rootStore = useContext(RootStoreContext);
  const { forgotPassword, pending } = rootStore.userStore;

  const { handleSubmit, control, errors } = useForm<IResetPasswordFormValues>({
    resolver: yupResolver(forgotPasswordValidationScheme),
    reValidateMode: 'onBlur',
    mode: 'onBlur',
    defaultValues: {
      userName: '',
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    await forgotPassword(data);
  });

  return (
    <form onSubmit={onSubmit} className={classes.root}>
      <InputField
        name="userName"
        mask="999999999999"
        label={t('COMMON.IIN')}
        control={control}
        error={errors?.userName?.message ?? ' '}
        fullWidth
      />
      <div>
        <Button
          type="submit"
          variant="outlined"
          size="large"
          className={classes.button}
          disabled={Object.keys(errors).length > 0 || pending}
        >
          {t('COMMON.SEND')}
        </Button>
      </div>
    </form>
  );
};

export default observer(ForgotPasswordForm);
