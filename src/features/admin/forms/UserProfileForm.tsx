import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { IRegisterFormValues } from '../../../app/models/user';
import { Control, DeepMap, FieldError } from 'react-hook-form';
import InputField from '../../../app/common/inputs/InputField';

interface IProps {
  control: Control<IRegisterFormValues>;
  errors: DeepMap<IRegisterFormValues, FieldError>;
}

const UserPersonalDataForm: FC<IProps> = ({ control, errors }) => {
  const { t } = useTranslation();

  return (
    <>
      <InputField
        name="identifier"
        label={t('COMMON.IDENTIFIER')}
        control={control}
        mask="999999999999"
        error={errors?.identifier?.message}
        fullWidth
      />
      <InputField
        name="lastName"
        label={t('COMMON.LAST_NAME')}
        control={control}
        error={errors?.lastName?.message}
        fullWidth
      />
      <InputField
        name="firstName"
        label={t('COMMON.FIRST_NAME')}
        control={control}
        error={errors?.firstName?.message}
        fullWidth
      />
      <InputField
        name="middleName"
        label={t('COMMON.MIDDLE_NAME')}
        control={control}
        error={errors?.middleName?.message}
        fullWidth
      />
      <InputField
        name="email"
        label={t('COMMON.EMAIL')}
        control={control}
        error={errors?.email?.message}
        fullWidth
      />
    </>
  );
};

export default UserPersonalDataForm;
