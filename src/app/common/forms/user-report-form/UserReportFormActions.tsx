import React, { useContext, useState, useEffect, Fragment } from 'react';
import { observer } from 'mobx-react-lite';
import { RootStoreContext } from '../../../stores/rootStore';
import { IFormSettingsButton } from '../../../models/loanApplication';
import UniversalDialog from '../../dialogs/UniversalDialog';
import ConfirmForm from '../comfirm-form/ConfirmForm';
import DeclineForm from '../decline-form/DeclineForm';

// Material UI
import { makeStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { Dictionary } from 'lodash';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    flexFlow: 'row wrap',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    padding: theme.spacing(4, 0, 2),
  },
}));

interface IProps {
  formId: string;
  buttons: IFormSettingsButton[];
}

const UserReportFormActions: React.FC<IProps> = ({ formId, buttons }) => {
  const classes = useStyles();
  const rootStore = useContext(RootStoreContext);
  const {
    userReportFormValues,
    completeTask,
    completeTaskLoading,
    setLoanApplicationTaskStatusId,
  } = rootStore.loadApplicationDetailsStore;

  const [modalOpen, setModalOpen] = useState<Dictionary<boolean>>({});

  useEffect(() => {
    const modalsStates = buttons.reduce((prev, current) => {
      return {
        ...prev,
        [current.taskStatusId]: false,
      };
    }, {});

    setModalOpen(modalsStates);
  }, [buttons]);

  const isButtonDisabled = (isApply: boolean) => {
    const checkboxValues = Object.values(userReportFormValues[formId].fields);
    if (checkboxValues.length === 0) return false;

    return isApply
      ? !checkboxValues.every((x) => x === true)
      : checkboxValues.every((x) => x === true);
  };

  const renderDialog = (button: IFormSettingsButton) => {
    return button.hasForm ? (
      <UniversalDialog
        open={modalOpen[button.taskStatusId] ?? false}
        onClose={() =>
          setModalOpen((state) => ({ ...state, [button.taskStatusId]: false }))
        }
        title={button.dialogTitle}
        content={
          <DeclineForm
            handleFormSubmit={(data) => completeTask(formId, data)}
            defaultValues={{ comment: '', files: [] }}
            isDecline={false}
          />
        }
      />
    ) : (
      <UniversalDialog
        open={modalOpen[button.taskStatusId] ?? false}
        onClose={() =>
          setModalOpen((state) => ({ ...state, [button.taskStatusId]: false }))
        }
        title={button.dialogTitle}
        content={
          <ConfirmForm
            text={button.dialogMessage}
            onReject={() =>
              setModalOpen((state) => ({
                ...state,
                [button.taskStatusId]: false,
              }))
            }
            onAccept={() => completeTask(formId, {})}
            acceptButtonDisabled={completeTaskLoading}
          />
        }
      />
    );
  };

  return (
    <div className={classes.root}>
      {buttons.map((button, idx) => (
        <Fragment key={idx}>
          <Button
            color={button.isApply ? 'primary' : 'default'}
            variant="contained"
            disabled={isButtonDisabled(button.isApply)}
            onClick={() => {
              setLoanApplicationTaskStatusId(button.taskStatusId);
              setModalOpen((state) => ({
                ...state,
                [button.taskStatusId]: true,
              }));
            }}
          >
            {button.name}
          </Button>
          {renderDialog(button)}
        </Fragment>
      ))}
    </div>
  );
};

export default observer(UserReportFormActions);
