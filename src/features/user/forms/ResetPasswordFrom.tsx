import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { IResetPasswordFormValues } from '../../../app/models/user';
import { RootStoreContext } from '../../../app/stores/rootStore';
import resetPasswordValidationScheme from '../../../app/validators/resetPasswordValidationScheme';
import InputField from '../../../app/common/inputs/InputField';

// Material UI
import { makeStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    maxWidth: 400,
  },
  button: {
    margin: '0 auto',
    display: 'block',
  },
}));

interface IProps {
  userName: string;
  token: string;
}

const ResetPasswordFrom: React.FC<IProps> = ({ userName, token }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const rootStore = useContext(RootStoreContext);
  const { resetPassword } = rootStore.userStore;

  const { handleSubmit, control, register, errors } =
    useForm<IResetPasswordFormValues>({
      resolver: yupResolver(resetPasswordValidationScheme),
      reValidateMode: 'onBlur',
      mode: 'onBlur',
      defaultValues: {
        userName,
        token,
        newPassword: '',
        confirmedNewPassword: '',
      },
    });

  const onSubmit = handleSubmit(async (data) => {
    await resetPassword(data);
  });

  return (
    <form onSubmit={onSubmit} className={classes.root}>
      <input
        type="text"
        {...register('userName')}
        defaultValue={userName}
        hidden
      />
      <input type="text" {...register('token')} defaultValue={token} hidden />
      <InputField
        name="newPassword"
        type="password"
        label={t('COMPONENTS.CHANGE_PASSWORD.NEW_PASSWORD')}
        control={control}
        error={errors?.newPassword?.message ?? ' '}
        fullWidth
      />
      <InputField
        name="confirmedNewPassword"
        type="password"
        label={t('COMPONENTS.CHANGE_PASSWORD.CONFIRMED_NEW_PASSWORD')}
        control={control}
        error={errors?.confirmedNewPassword?.message ?? ' '}
        fullWidth
      />

      <div>
        <Button
          type="submit"
          variant="outlined"
          size="large"
          className={classes.button}
          disabled={Object.keys(errors).length > 0}
        >
          {t('COMMON.SAVE')}
        </Button>
      </div>
    </form>
  );
};

export default ResetPasswordFrom;
