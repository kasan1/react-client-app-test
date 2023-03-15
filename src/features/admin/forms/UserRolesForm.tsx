import { FC, useEffect, useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';
import { RootStoreContext } from '../../../app/stores/rootStore';
import { IDictionaryItem } from '../../../app/models/common';
import { IRegisterFormValues } from '../../../app/models/user';
import { Control, DeepMap, FieldError } from 'react-hook-form';
import SelectField from '../../../app/common/inputs/SelectField';

interface IProps {
  control: Control<IRegisterFormValues>;
  errors: DeepMap<IRegisterFormValues, FieldError>;
}

const UserRolesForm: FC<IProps> = ({ control, errors }) => {
  const { t } = useTranslation();
  const [roles, setRoles] = useState<IDictionaryItem[]>([]);

  const rootStore = useContext(RootStoreContext);
  const { getDictionaryValues } = rootStore.dictionaryStore;

  useEffect(() => {
    const fetch = async () => {
      const roles = await getDictionaryValues('role');
      if (roles) {
        setRoles(roles);
      }
    };

    fetch();
  }, [getDictionaryValues]);

  return (
    <>
      <SelectField
        name="roles"
        label={t('COMMON.ROLES')}
        control={control}
        options={roles}
        multiple
      />
    </>
  );
};

export default observer(UserRolesForm);
