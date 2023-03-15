import React from 'react';

// Material UI
import { makeStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import AttachFileIcon from '@material-ui/icons/AttachFile';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    flexFlow: 'row wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: theme.spacing(2, 0)
  }
}))

interface IProps {
  setFiles: (event: React.ChangeEvent<HTMLInputElement>) => void;
  accept?: string;
  value: FileList;
  size?: 'small' | 'medium' | 'large';
}

const FileInput: React.FC<IProps> = ({ setFiles, accept, value, size }) => {
  const classes = useStyles();

  const id = `icon-button-file-${Math.random()}`;
  return (
    <div className={classes.root}>
      <div>
        {Array.from(value).map((file: File, idx: number) => (
          <Typography key={idx}>{file.name}</Typography>
        ))}
      </div>
      <div>
        <input
          color="primary"
          accept={accept}
          type="file"
          onChange={setFiles}
          id={id}
          multiple
          hidden
        />
        <label htmlFor={id}>
          <Button
            variant="contained"
            component="span"
            color="default"
            size={size ? size : 'medium'}
          >
            <AttachFileIcon />
          </Button>
        </label>
      </div>
    </div>
  )
}

export default FileInput
