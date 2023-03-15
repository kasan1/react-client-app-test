import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
  }
}));

interface IProps {
  open: boolean;
  onClose: () => void;
  fullScreen?: boolean;
  title?: string;
  content: React.ReactElement | null;
}

const UniversalDialog: React.FC<IProps> = ({
  open,
  onClose,
  title,
  content,
  fullScreen = false,
}) => {
  const classes = useStyles();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      scroll="body"
      maxWidth="lg"
      aria-labelledby="dialog-title"
      classes={{
        root: classes.root,
      }}
    >
      {title && <DialogTitle id="dialog-title">{title}</DialogTitle>}
      <DialogContent>
        {content}
      </DialogContent>
    </Dialog>
  );
};

export default UniversalDialog;
