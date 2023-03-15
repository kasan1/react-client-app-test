import React, { Fragment, useState, useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { RootStoreContext } from '../../../../stores/rootStore';
import { ICommentListItem } from '../../../../models/common';
import UniversalDialog from '../../../dialogs/UniversalDialog';
import ConfirmForm from '../../comfirm-form/ConfirmForm';

// Material UI
import { makeStyles, Theme } from '@material-ui/core/styles';
import Fade from '@material-ui/core/Fade';
import Link from '@material-ui/core/Link';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import LinearProgress from '@material-ui/core/LinearProgress';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import DeleteIcon from '@material-ui/icons/Delete';

const useStyles = makeStyles((theme: Theme) => ({
  commentsListWrapper: {
    margin: theme.spacing(1)
  },
  date: {
    float: 'right',
    display: 'block'
  },
  listItemText: {
    marginRight: theme.spacing(1.5)
  },
  files: {
    paddingLeft: theme.spacing(2)
  },
  linearProgress: {
    marginTop: theme.spacing(2)
  }
}));

interface IProps {  
  comments: ICommentListItem[];
  commentsLoading: boolean;
  isReadOnly: boolean;
  setComments: (value: React.SetStateAction<ICommentListItem[]>) => void;
  setCommentsCount: React.Dispatch<React.SetStateAction<number>>;
}

const CommentsList: React.FC<IProps> = ({ comments, commentsLoading, setComments, setCommentsCount, isReadOnly }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const rootStore = useContext(RootStoreContext);
  const { 
    removeComment
  } = rootStore.loadApplicationDetailsStore;
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedCommentId, setSelectedCommentId] = useState('');

  const onRemove = async () => {
    setIsDeleting(true);

    await removeComment(selectedCommentId)
      .finally(() => {
        setComments(comments.filter(x => x.commentId !== selectedCommentId));
        setCommentsCount(count => count - 1);
        setDeleteDialogOpen(false);
        setIsDeleting(false);
      });
  }

  if (commentsLoading)
    return <LinearProgress className={classes.linearProgress} />

  return (
    <Fade in={!commentsLoading}>
      <List className={classes.commentsListWrapper}>
        {comments.map((comment, idx) => (
          <Fragment key={idx}>
            <ListItem alignItems="flex-start">
              <ListItemText
                className={classes.listItemText}
                secondary={comment.text}
              >
                <span>{comment.author}</span>
                <span className={classes.date}>{format(new Date(comment.date), 'dd-MM-yyyy HH:mm')}</span>
              </ListItemText>
              {!isReadOnly && <ListItemSecondaryAction>
                <IconButton 
                  edge="end" 
                  aria-label="delete"
                  onClick={() => {
                    setSelectedCommentId(comment.commentId);
                    setDeleteDialogOpen(true);
                  }}
                >
                  <DeleteIcon color="secondary" />
                </IconButton>
              </ListItemSecondaryAction>}
            </ListItem>
            <List component="div" disablePadding>
              {comment.files.map((file, index) => (
                <ListItem key={index} button className={classes.files}>
                  <ListItemIcon>
                    <InsertDriveFileIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText>
                    <Link href={`/${file.url}`} download={file.filename}>{file.filename}</Link>
                  </ListItemText>
                </ListItem>
              ))}
            </List>
            <Divider />
        </Fragment>
        ))}
        {!isReadOnly && <UniversalDialog 
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          title={t('COMPONENTS.COMMENTS_LIST.DELETE_DIALOG_TITLE')}
          content={<ConfirmForm  
            text={t('COMPONENTS.COMMENTS_LIST.DELETE_DIALOG_SUBTITLE')}
            onReject={() => setDeleteDialogOpen(false)}
            onAccept={onRemove}
            acceptButtonDisabled={isDeleting}
          />}
        />}
      </List>
    </Fade>
  )
}

export default observer(CommentsList);
