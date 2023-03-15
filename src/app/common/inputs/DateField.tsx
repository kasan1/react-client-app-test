import React from 'react';
import { Control, Controller } from 'react-hook-form';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

// Material UI
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  helperText: {
    color: 'red',
    marginBottom: theme.spacing(1.2),
  },
}));

interface IProps {
  name: string;
  label: string;
  error?: string;
  control: Control<Record<string, any>>;
  className?: string | undefined;
}

const DateField: React.FC<IProps> = ({
  name,
  label,
  error,
  control,
  className,
}) => {
  const classes = useStyles();

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Controller
        name={name}
        control={control}
        defaultValue={null}
        render={({ value, onChange, onBlur }) => (
          <KeyboardDatePicker
            disableToolbar
            variant="inline"
            inputVariant="outlined"
            format="dd/MM/yyyy"
            className={className}
            id="birth-date-picker"
            label={label}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
            helperText={error ?? ' '}
            FormHelperTextProps={{
              className: classes.helperText,
            }}
          />
        )}
      />
    </MuiPickersUtilsProvider>
  );
};

export default DateField;
