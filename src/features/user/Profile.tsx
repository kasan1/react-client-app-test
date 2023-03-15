import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';
import { RootStoreContext } from '../../app/stores/rootStore';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { IProfileFormValues } from '../../app/models/profile';
import profileValidationScheme from '../../app/validators/profileValidationScheme';
import UniversalDialog from '../../app/common/dialogs/UniversalDialog';
import ChangePasswordForm from './forms/ChangePasswordForm';
import InputField from '../../app/common/inputs/InputField';
import DateField from '../../app/common/inputs/DateField';

import { makeStyles, Theme } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Zoom from '@material-ui/core/Zoom';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import VpnKeyIcon from '@material-ui/icons/VpnKey';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(4),
  },
  title: {
    marginBottom: theme.spacing(6),
    display: 'flex',
    flexFlow: 'row nowrap',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  form: {
    display: 'flex',
    flexFlow: 'row wrap',
    justifyContent: 'center',
  },
  leftSide: {
    flex: 1,
    maxWidth: 400,
  },
  rightSide: {
    flex: 2,
    maxWidth: 1000,
  },
  formGroup: {
    marginTop: 40,
    display: 'flex',
    flexFlow: 'row wrap',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  input: {
    width: 300,
  },
  image: {
    width: 280,
    height: 280,
    position: 'relative',
    '& > img': {
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      border: '30px solid #fefefe',
    },
    [theme.breakpoints.down('sm')]: {
      margin: '0 auto',
    },
  },
  addButtonImage: {
    position: 'absolute',
    left: '50%',
    bottom: 0,
    backgroundColor: theme.palette.primary.main,
    border: `3px solid ${theme.palette.common.white}`,
    transform: 'translate(-50%, 25%)',
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
  },
  addButtonIcon: {
    color: theme.palette.common.white,
  },
  changePasswordButton: {
    marginLeft: 'auto',
  },
  submitButton: {
    margin: `${theme.spacing(2)}px auto`,
    display: 'block',
  },
}));

const Profile = () => {
  const rootStore = useContext(RootStoreContext);
  const { loadProfile, profile, loading, updateProfile } =
    rootStore.profileStore;

  const [modalOpen, setModalOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState('/assets/profile-default.png');

  const classes = useStyles();
  const { t } = useTranslation();

  const { handleSubmit, control, errors, setValue, watch } =
    useForm<IProfileFormValues>({
      defaultValues: {
        firstName: profile?.firstName,
        lastName: profile?.lastName,
        middleName: profile?.middleName,
        birthDate: profile?.birthDate ?? new Date(),
        email: profile?.email,
        phone: profile?.phone,
        image: undefined,
      },
      resolver: yupResolver(profileValidationScheme),
      reValidateMode: 'onBlur',
      mode: 'onBlur',
    });

  useEffect(() => {
    if (profile === null) {
      loadProfile();
    } else {
      setValue('firstName', profile.firstName ?? '');
      setValue('lastName', profile.lastName ?? '');
      setValue('middleName', profile.middleName ?? '');
      setValue('birthDate', new Date(profile.birthDate));
      setValue('email', profile.email ?? '');
      setValue('phone', profile.phone);
      if (profile.image !== null)
        setImageSrc(
          process.env.REACT_APP_BPM_API_URL_ROOT + profile.image?.url,
        );
    }
  }, [loadProfile, profile, setValue]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      updateProfile(data);
    } catch (ex) {
      // TODO: set form errors
      console.log(ex);
    }
  });

  const imageValue = watch('image');

  return (
    <div className={classes.root}>
      <div className={classes.title}>
        <Typography variant="h6">{t('COMPONENTS.PROFILE.TITLE')}</Typography>
        <Tooltip
          title={t('COMPONENTS.PROFILE.CHANGE_PASSWORD').toString()}
          TransitionComponent={Zoom}
        >
          <Button
            variant="outlined"
            color="primary"
            size="large"
            className={classes.changePasswordButton}
            onClick={() => setModalOpen(true)}
          >
            <VpnKeyIcon color="primary"></VpnKeyIcon>
          </Button>
        </Tooltip>
      </div>
      <form className={classes.form} onSubmit={onSubmit}>
        <div className={classes.leftSide}>
          <div className={classes.image}>
            <img
              src={imageValue ? URL.createObjectURL(imageValue) : imageSrc}
              alt="profile"
            />
            <label htmlFor="image">
              <Tooltip
                title={t('COMPONENTS.PROFILE.CHANGE_IMAGE').toString()}
                TransitionComponent={Zoom}
              >
                <IconButton className={classes.addButtonImage} component="span">
                  {profile?.image !== null ? (
                    <EditIcon className={classes.addButtonIcon} />
                  ) : (
                    <AddIcon className={classes.addButtonIcon} />
                  )}
                </IconButton>
              </Tooltip>
            </label>
            <Controller
              name="image"
              control={control}
              defaultValue={null}
              render={() => (
                <input
                  id="image"
                  accept="image/*"
                  type="file"
                  onChange={(e) => setValue('image', e!.target!.files![0])}
                  hidden
                />
              )}
            />
          </div>
        </div>
        <div className={classes.rightSide}>
          <div className={classes.formGroup}>
            <InputField
              name="firstName"
              label={t('COMMON.FIRST_NAME')}
              control={control}
              error={errors?.firstName?.message}
              className={classes.input}
            />
            <InputField
              name="lastName"
              label={t('COMMON.LAST_NAME')}
              control={control}
              error={errors?.lastName?.message}
              className={classes.input}
            />
            <InputField
              name="middleName"
              label={t('COMMON.MIDDLE_NAME')}
              control={control}
              error={errors?.middleName?.message}
              className={classes.input}
            />
            <DateField
              name="birthDate"
              label={t('COMMON.BIRTH_DATE')}
              control={control}
              error={errors?.birthDate?.message}
              className={classes.input}
            />
            <InputField
              name="email"
              label={t('COMMON.EMAIL')}
              control={control}
              error={errors?.email?.message}
              className={classes.input}
            />
            <InputField
              name="phone"
              label={t('COMMON.PHONE')}
              control={control}
              mask="8 (999) 999 99 99"
              error={errors?.phone?.message}
              className={classes.input}
            />
          </div>
          <div>
            <Button
              color="primary"
              variant="outlined"
              type="submit"
              size="large"
              className={classes.submitButton}
              disabled={Object.keys(errors).length > 0 || loading}
            >
              {t('COMMON.SAVE')}
            </Button>
          </div>
        </div>
      </form>
      <UniversalDialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={t('COMPONENTS.PROFILE.CHANGE_PASSWORD')}
        content={<ChangePasswordForm callback={() => setModalOpen(false)} />}
      />
    </div>
  );
};

export default observer(Profile);
