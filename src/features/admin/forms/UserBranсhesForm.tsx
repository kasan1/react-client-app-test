import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';
import { RootStoreContext } from '../../../app/stores/rootStore';
import { IDictionaryItem } from '../../../app/models/common';
import { Control, DeepMap, FieldError, useFieldArray } from 'react-hook-form';
import { IRegisterFormValues } from '../../../app/models/user';
import SelectField from '../../../app/common/inputs/SelectField';

// Material UI
import { makeStyles, Theme } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import DeleteIcon from '@material-ui/icons/Delete';

const useStyles = makeStyles((theme: Theme) => ({
  field: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'top',
  },
  removeButton: {
    marginTop: theme.spacing(1.4),
  },
}));

interface IProps {
  control: Control<IRegisterFormValues>;
  trigger: (name?: string | string[] | undefined) => Promise<boolean>;
  errors: DeepMap<IRegisterFormValues, FieldError>;
}

const UserBranchesForm: React.FC<IProps> = ({ control, errors, trigger }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const [branches, setBranches] = useState<IDictionaryItem[]>([]);
  const [positions, setPositions] = useState<IDictionaryItem[]>([]);

  const rootStore = useContext(RootStoreContext);
  const { getDictionaryValues } = rootStore.dictionaryStore;

  const { fields, append, remove } = useFieldArray({
    name: 'branches',
    control,
  });

  useEffect(() => {
    trigger();
  }, [fields, trigger]);

  useEffect(() => {
    const fetch = async () => {
      const branches = await getDictionaryValues('branch');
      if (branches) {
        setBranches(branches);
      }

      const positions = await getDictionaryValues('position');
      if (positions) {
        setPositions(positions);
      }
    };

    fetch();
  }, [getDictionaryValues]);

  return (
    <>
      {fields.map((field, index) => (
        <div key={field.id} className={classes.field}>
          <SelectField
            name={`branches.${index}.branchIds`}
            label={t('COMMON.BRANCH')}
            defaultValue={field.branchIds}
            control={control}
            options={branches}
            multiple
          />
          <SelectField
            name={`branches.${index}.positionId`}
            label={t('COMMON.POSITION')}
            defaultValue={field.positionId}
            control={control}
            options={positions}
            error={
              errors?.branches !== undefined
                ? errors?.branches[index]?.positionId?.message
                : ` `
            }
          />
          <div className={classes.removeButton}>
            <IconButton color="secondary" onClick={() => remove(index)}>
              <DeleteIcon />
            </IconButton>
          </div>
        </div>
      ))}

      <IconButton
        color="secondary"
        onClick={() => append({ branchIds: [], positionId: '' })}
      >
        <AddCircleIcon />
      </IconButton>
    </>
  );
};

export default observer(UserBranchesForm);
