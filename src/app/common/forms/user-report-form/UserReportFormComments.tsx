import React, { useEffect, useState, useContext, useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { RootStoreContext } from '../../../stores/rootStore';
import { IFormSettingsField } from '../../../models/loanApplication';
import CommentsForm from './comments/CommentsForm';
import CommentsList from './comments/CommentsList';

// Material UI
import { makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { ICommentListItem } from '../../../models/common';

const useStyles = makeStyles((theme: Theme) => ({
  commentsCount: {
    marginLeft: theme.spacing(2),
    textDecoration: 'underline',
    cursor: 'pointer'
  }
}));

interface IProps {
  formId: string;
  field: IFormSettingsField;
  isReadOnly: boolean;
}

const UserReportFormComments: React.FC<IProps> = ({ formId, field, isReadOnly }) => {  
  const classes = useStyles();
  const { t } = useTranslation();
  const rootStore = useContext(RootStoreContext);
  const { getComments } = rootStore.loadApplicationDetailsStore;

  const [page, setPage] = useState(1);
  const [pageLimit] = useState(3);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [comments, setComments] = useState<ICommentListItem[]>([]);
  const [commentsCount, setCommentsCount] = useState(field.countOfComments);
  
  const fetchComments = useCallback(async (page: number, pageLimit: number, isNew: boolean = false) => {
    setCommentsLoading(true);

    const commentsResult = await getComments(field.id, page, pageLimit).finally(() => setCommentsLoading(false));
    
    if (commentsResult !== null) {
      if (page === 1 && pageLimit === 3) {
        setComments(commentsResult.list);
      } else {
        setComments(comments => isNew 
          ? [ ...comments, ...commentsResult.list ]
          : [ ...commentsResult.list, ...comments ]);
      }

      setCommentsCount(commentsResult.count);
      }
    }, [field.id, setComments, setCommentsCount, getComments]);
  
    useEffect(() => {
      fetchComments(page, pageLimit);
    }, [page, pageLimit, fetchComments]);
    
  return (
    <div>
      {commentsCount > comments.length ? (
        <Typography 
          onClick={() => commentsCount > pageLimit 
            ? setPage(page + 1) 
            : fetchComments(1, pageLimit)}
          variant="caption" 
          component="div"
          className={classes.commentsCount} 
        >
          {t('COMPONENTS.USER_REPORT_FORM.VIEW_ALL_COMMENTS')} ({commentsCount - comments.length})
        </Typography>) 
        : null
      }
      <CommentsList 
        comments={comments}
        commentsLoading={commentsLoading}
        isReadOnly={isReadOnly} 
        setComments={setComments} 
        setCommentsCount={setCommentsCount} 
      />
      {!isReadOnly && <CommentsForm formId={formId} field={field} fetchComments={fetchComments} />}
    </div>
  )
}

export default observer(UserReportFormComments);
