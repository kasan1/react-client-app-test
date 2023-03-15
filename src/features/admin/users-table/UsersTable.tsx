import { FC, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { RootStoreContext } from '../../../app/stores/rootStore';
import { observer } from 'mobx-react-lite';
import Spinner from '../../../app/layout/Spinner';

// Material UI
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import TablePagination from '@material-ui/core/TablePagination';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

const useStyles = makeStyles((theme) => ({
  table: {
    minHeight: (props: { loading: boolean }) =>
      props.loading ? '400px' : 'auto',
  },
  tableHead: {
    '& th': {
      fontWeight: 600,
    },
  },
  deleteButton: {
    padding: theme.spacing(1),
  },
}));

const UsersTable: FC = () => {
  const { t } = useTranslation();
  const rootContext = useContext(RootStoreContext);
  const {
    users,
    usersCount,
    loading,
    page,
    pageLimit,
    handleChangePage,
    handleChangePageLimit,
    getUsers,
  } = rootContext.adminStore;
  const classes = useStyles({ loading });

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  return (
    <div>
      <TableContainer component={Paper}>
        <Table className={classes.table}>
          <TableHead className={classes.tableHead}>
            <TableRow>
              <TableCell>{t('COMPONENTS.USERS_TABLE.ORDER')}</TableCell>
              <TableCell>{t('COMPONENTS.USERS_TABLE.USERNAME')}</TableCell>
              <TableCell>{t('COMPONENTS.USERS_TABLE.FULLNAME')}</TableCell>
              <TableCell>{t('COMPONENTS.USERS_TABLE.EMAIL')}</TableCell>
              <TableCell>{t('COMPONENTS.USERS_TABLE.POSITION')}</TableCell>
              {/* <TableCell>{t('COMPONENTS.USERS_TABLE.ACTIONS')}</TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6}>
                  <Spinner />
                </TableCell>
              </TableRow>
            ) : (
              users.map((user, index) => (
                <TableRow key={user.id}>
                  <TableCell>{index + 1 + page * pageLimit}</TableCell>
                  <TableCell>{user.userName}</TableCell>
                  <TableCell>
                    {`${user.lastName} ${user.firstName} ${user.middleName}`.trim()}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.positions.join(', ')}</TableCell>
                  {/* <TableCell>
                    <IconButton
                      className={classes.deleteButton}
                      onClick={() =>
                        console.log(`User ${user.id} should be deleted`)
                      }
                    >
                      <DeleteIcon color="secondary" />
                    </IconButton>
                  </TableCell> */}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        rowsPerPageOptions={[5, 10, 25]}
        page={page}
        rowsPerPage={pageLimit}
        count={usersCount}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangePageLimit}
      />
    </div>
  );
};

export default observer(UsersTable);
