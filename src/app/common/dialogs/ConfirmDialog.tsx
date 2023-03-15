import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
  },
}));

interface IProps {
  open: boolean;
  onReject: () => void;
  onConfirm: () => void;
  title: string;
  content: string;
}

const ConfirmDialog: React.FC<IProps> = ({
  open,
  onReject,
  title,
  content,
  onConfirm,
}) => {
  const classes = useStyles();

  return (
    <Dialog
      open={open}
      onClose={onReject}
      scroll="body"
      maxWidth="lg"
      aria-labelledby="dialog-title"
      classes={{
        root: classes.root,
      }}
    >
      <DialogTitle id="dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{content}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={() => onReject()}>
          Нет
        </Button>
        <Button color="primary" onClick={() => onConfirm()}>
          Да
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
