import React, { useState, useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { IFileListItem } from '../../../../app/models/common';
import { RootStoreContext } from '../../../../app/stores/rootStore';
import ConfirmDialog from '../../../../app/common/dialogs/ConfirmDialog';

// Material UI
import { makeStyles, Theme } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: 400,
  },
  link: {
    wordBreak: 'break-word',
    marginRight: theme.spacing(3),
  },
}));

interface IProps {
  data: IFileListItem[];
}

const Documents: React.FC<IProps> = ({ data }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const rootStore = useContext(RootStoreContext);
  const { uploadDocuments, uploadingFiles, removeDocument } =
    rootStore.loadApplicationDetailsStore;

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedFileId, setSelectedFileId] = useState<string>('');

  return (
    <div className={classes.root}>
      <List dense>
        {data.map((file, idx) => (
          <ListItem key={idx}>
            <ListItemText className={classes.link}>
              <Link href={`/${file.url}`} download={file.filename}>
                {file.filename}
              </Link>
            </ListItemText>
            <ListItemSecondaryAction>
              <IconButton
                color="secondary"
                disabled={uploadingFiles}
                onClick={() => {
                  setSelectedFileId(file.id);
                  setConfirmOpen(true);
                }}
              >
                <HighlightOffIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
      <div>
        <input
          color="primary"
          type="file"
          onChange={(e) => uploadDocuments(e.target.files)}
          id="icon-button-file"
          multiple
          hidden
        />
        <label htmlFor="icon-button-file">
          <Button
            variant="contained"
            component="span"
            color="primary"
            disabled={uploadingFiles}
          >
            {t('COMMON.UPLOAD')}
            <AttachFileIcon />
          </Button>
        </label>
      </div>
      <ConfirmDialog
        open={confirmOpen}
        onReject={() => setConfirmOpen(false)}
        onConfirm={() => {
          removeDocument(selectedFileId).then(() => setConfirmOpen(false));
        }}
        title="Внимание!"
        content="Вы действительно хотите удалить прикрепленный файл?"
      />
    </div>
  );
};

export default observer(Documents);
