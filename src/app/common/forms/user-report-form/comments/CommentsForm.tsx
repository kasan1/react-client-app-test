import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { RootStoreContext } from '../../../../stores/rootStore';
import { IFormSettingsField, IUserReportCommentFormValues } from '../../../../models/loanApplication';
import FileInput from '../../../inputs/FileInput';

// Material UI
import { makeStyles, Theme } from '@material-ui/core/styles';
import Fade from '@material-ui/core/Fade';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import SendIcon from '@material-ui/icons/Send';

const useStyles = makeStyles((theme: Theme) => ({
  commentInputWrapper: {
    display: 'flex',
    flexFlow: 'row nowrap',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  filesInputWrapper: {
    margin: theme.spacing(1)
  },
  commentInput: {
    margin: theme.spacing(1)
  }
}));

interface IProps {
  formId: string;
  field: IFormSettingsField;
  fetchComments: (page: number, pageLimit: number, isNew?: boolean) => Promise<void>;
}

const CommentsForm: React.FC<IProps> = ({ formId, field, fetchComments }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const rootStore = useContext(RootStoreContext);
  const { 
    userReportFormValues,
    addComment
  } = rootStore.loadApplicationDetailsStore;

  const { control, handleSubmit, watch, setValue, formState: { isSubmitting }, reset } = useForm<IUserReportCommentFormValues>({
    defaultValues: {
      comment: '',
      files: []
    }
  });

  const watchComment = watch('comment', '');

  const onSubmit = async (data: IUserReportCommentFormValues) => {
    await addComment(field.id, data.comment, data.files)
      .finally(async () => await fetchComments(1, 1, true).finally(reset));
  }
  
  return (
    <Fade in={!userReportFormValues[formId].fields[field.id]}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={classes.commentInputWrapper}>
          <Controller 
            name='comment'
            control={control}
            render={({ onChange, value }) => (
              <TextField
                value={value}
                onChange={onChange}
                className={classes.commentInput}
                label={t('COMMON.COMMENT')}
                variant="outlined"
                size="small"
                fullWidth
                multiline
              />
            )}
          />
          <Fade in={watchComment !== ''}>
            <IconButton
              type="submit"
              color="primary"
              disabled={isSubmitting}
            >
              <SendIcon />
            </IconButton>
          </Fade>
        </div>
        <div className={classes.filesInputWrapper}>
          <Controller 
            name="files"
            control={control}
            render={({ value }) => (
              <FileInput 
                key={field.id}
                setFiles={(e) => setValue('files', e.target.files)}
                value={value}
                size="small"
              />
            )}
          />
        </div>
      </form>
    </Fade>
  )
}

export default observer(CommentsForm);
