import React from 'react';
import { Control, Controller } from 'react-hook-form';
import InputMask from 'react-input-mask';

// Material UI
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme) => ({
  helperText: {
    color: 'red',
    marginBottom: theme.spacing(1.2),
  },
}));

interface IProps {
  name: string;
  label: string;
  value?: string;
  type?: string;
  error?: string;
  control: Control<Record<string, any>>;
  mask?: string;
  fullWidth?: boolean;
  style?: React.CSSProperties | undefined;
  className?: string | undefined;
}

const InputField: React.FC<IProps> = ({
  name,
  label,
  value,
  type = 'text',
  error,
  control,
  mask,
  fullWidth,
  style,
  className,
}) => {
  const classes = useStyles();

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={value ?? ''}
      render={({ value, onChange, onBlur }) => {
        return mask ? (
          <InputMask
            mask={mask}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
          >
            {(inputProps: any) => (
              <TextField
                {...inputProps}
                type={type}
                label={label}
                helperText={error ?? ' '}
                FormHelperTextProps={{
                  className: classes.helperText,
                }}
                className={className}
                variant="outlined"
                style={style}
                fullWidth={!!fullWidth}
              />
            )}
          </InputMask>
        ) : (
          <TextField
            value={value}
            type={type}
            onChange={onChange}
            onBlur={onBlur}
            label={label}
            helperText={error ?? ' '}
            FormHelperTextProps={{
              className: classes.helperText,
            }}
            className={className}
            variant="outlined"
            style={style}
            fullWidth={!!fullWidth}
          />
        );
      }}
    />
  );
};

export default InputField;
