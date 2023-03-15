import React from 'react';
import { useTranslation } from "react-i18next";
import { useForm, Controller } from 'react-hook-form';
import { ICompleteTaskFormValues } from '../../../models/loanApplication';
import FileInput from '../../inputs/FileInput';

// Material UI
import { makeStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme: Theme) => ({
  form: {
    [theme.breakpoints.up('md')]: {
      minWidth: 500
    }
  },
  submitBtn: {
    margin: `${theme.spacing(2)}px auto`,
    display: 'block'
  }
}))

interface IProps {
  handleFormSubmit: (data: Partial<ICompleteTaskFormValues>) => Promise<void>;
  defaultValues: Partial<ICompleteTaskFormValues>;
  isDecline?: boolean;
}

const DeclineForm: React.FC<IProps> = ({ handleFormSubmit, defaultValues, isDecline = true }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const { handleSubmit, control, errors, setValue, formState: { isSubmitting } } = useForm<Partial<ICompleteTaskFormValues>>({
    defaultValues: defaultValues
  });

  const onSubmit = async (data: Partial<ICompleteTaskFormValues>) => {
    await handleFormSubmit(data);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
      <Controller 
        name='comment'
        control={control}
        render={({ onChange, onBlur, value }) => 
          <TextField 
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            label={isDecline ? t('COMMON.COMMENT') : t('COMMON.NOTES')}
            variant="outlined" 
            rows={4}
            error={!!errors?.comment}
            helperText={errors?.comment?.message}
            multiline
            fullWidth
          />
        }
      />
      <Controller 
        name="files"
        control={control}
        render={({ value }) => (
          <FileInput 
            setFiles={(e) => setValue('files', e.target.files)}
            value={value}
          />
        )}
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        className={classes.submitBtn}
        disabled={isSubmitting}
      >
        {t('COMMON.SEND')}
      </Button>
    </form>
  )
}

export default DeclineForm
