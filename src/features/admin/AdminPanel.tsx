import { FC, useState } from 'react';
import { IRegisterFormValues } from '../../app/models/user';
import UsersTable from './users-table/UsersTable';
import UniversalDialog from '../../app/common/dialogs/UniversalDialog';
import FormsStepper from './stepper/FormsStepper';

// Material UI
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
  description: {
    margin: theme.spacing(3, 0),
  },
  addButton: {
    marginBottom: theme.spacing(3),
  },
}));

const AdminPanel: FC = () => {
  const classes = useStyles();
  const [addDialogOpen, setAddDialogOpen] = useState<boolean>(false);
  const [formValues, setFormValues] = useState<IRegisterFormValues>({
    identifier: '',
    lastName: '',
    firstName: '',
    middleName: '',
    email: '',
    branches: [{ branchIds: [], positionId: '' }],
    roles: [],
  });

  return (
    <div>
      <Typography variant="h5">Управлять пользователями</Typography>
      <Typography className={classes.description}>
        Создайте новых пользователей или обновите существующих. Также здесь вы
        можете присвоить им роли.
      </Typography>
      <Button
        color="primary"
        variant="contained"
        className={classes.addButton}
        onClick={() => setAddDialogOpen(true)}
      >
        Добавить нового пользователя
      </Button>
      <UsersTable />
      <UniversalDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        title="Форма добавления пользователя"
        content={
          <FormsStepper
            onComplete={() => setAddDialogOpen(false)}
            formValues={formValues}
          />
        }
      />
    </div>
  );
};

export default AdminPanel;
