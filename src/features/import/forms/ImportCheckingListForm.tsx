import { useContext, useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';
import { RootStoreContext } from '../../../app/stores/rootStore';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { IDictionaryItem } from '../../../app/models/common';
import { IImportCheckingListFormValues } from '../../../app/models/import';
import importValidationScheme from '../../../app/validators/importValidationScheme';
import SelectField from '../../../app/common/inputs/SelectField';

// Material UI
import { makeStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Alert from '@material-ui/lab/Alert';
import FormHelperText from '@material-ui/core/FormHelperText';
import AttachFileIcon from '@material-ui/icons/AttachFile';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: '100%',
  },
  formContainer: {
    maxWidth: 600,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    margin: theme.spacing(3, 0),
  },
  label: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
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

const ImportCheckingListForm = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [checkingListTypes, setCheckingListTypes] = useState<IDictionaryItem[]>(
    [],
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const rootStore = useContext(RootStoreContext);
  const { getDictionaryValues } = rootStore.dictionaryStore;
  const { loading, importCheckingList } = rootStore.importStore;

  const { handleSubmit, control, errors, setValue, reset, watch } =
    useForm<IImportCheckingListFormValues>({
      resolver: yupResolver(importValidationScheme),
      reValidateMode: 'onBlur',
      mode: 'onBlur',
      defaultValues: {
        typeId: '',
        file: null,
      },
    });

  useEffect(() => {
    const fetch = async () => {
      const checkingListTypes = await getDictionaryValues('checkingListType');
      if (checkingListTypes) {
        setCheckingListTypes(checkingListTypes);
      }
    };

    fetch();
  }, [getDictionaryValues]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      setErrorMessage(null);

      await importCheckingList(data);

      reset();
      fileInputRef.current!.value = '';
    } catch (ex) {
      // @ts-ignore
      if (ex && 'Message' in ex) {
        // @ts-ignore
        setErrorMessage(ex.Message);
      }
    }
  });

  const fileInputValue = watch('file');

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
        <SelectField
          name="typeId"
          label={t('COMPONENTS.IMPORT.TYPE')}
          control={control}
          options={checkingListTypes}
          error={errors?.typeId?.message || undefined}
        />
        <label htmlFor="attachment" className={classes.label}>
          <Controller
            name="file"
            control={control}
            defaultValue={null}
            render={() => (
              <input
                id="attachment"
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                type="file"
                ref={fileInputRef}
                onChange={(e) =>
                  setValue('file', e!.target!.files![0], {
                    shouldValidate: true,
                  })
                }
                hidden
              />
            )}
          />
          <Button
            variant={!fileInputValue ? 'outlined' : 'contained'}
            color="secondary"
            component="span"
            startIcon={<AttachFileIcon />}
          >
            {t('COMPONENTS.IMPORT.FILE')}
          </Button>
          {errors?.file && (
            <FormHelperText className={classes.helperText}>
              {(errors.file as any).message}
            </FormHelperText>
          )}
        </label>
        <div>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            className={classes.button}
            disabled={Object.keys(errors).length > 0 || loading}
          >
            {t('COMPONENTS.IMPORT.IMPORT')}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default observer(ImportCheckingListForm);
