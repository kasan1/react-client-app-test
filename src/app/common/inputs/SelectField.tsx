import React from 'react';
import { Control, Controller } from 'react-hook-form';
import { IDictionaryItem } from '../../models/common';

// Material UI
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1, 0.5),
    minWidth: 220,
  },
  helperText: {
    color: 'red',
  },
}));

interface IProps {
  name: string;
  label: string;
  defaultValue?: string;
  error?: string;
  control: Control<Record<string, any>>;
  options: IDictionaryItem[];
  multiple?: boolean;
}

const SelectField: React.FC<IProps> = ({
  name,
  label,
  defaultValue,
  error,
  control,
  options,
  multiple = false,
}) => {
  const classes = useStyles();

  const renderValue = (value: unknown) =>
    options
      .filter((o) => (value as string[]).includes(o.id))
      .map((o) => o.name)
      .join(', ');

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ value, onChange, onBlur }) => (
        <FormControl variant="outlined" className={classes.formControl}>
          <InputLabel>{label}</InputLabel>
          <Select
            label={label}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            multiple={multiple}
            renderValue={renderValue}
          >
            {options.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {multiple && (
                  <Checkbox checked={value.indexOf(option.id) > -1} />
                )}
                {option.name}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText className={classes.helperText}>
            {error}
          </FormHelperText>
        </FormControl>
      )}
    />
  );
};

export default SelectField;
