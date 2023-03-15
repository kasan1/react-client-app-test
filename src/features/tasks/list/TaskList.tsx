import React, { Fragment, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { RootStoreContext } from '../../../app/stores/rootStore';
import { ILoanApplicationListItem } from '../../../app/models/loanApplication';
import Spinner from '../../../app/layout/Spinner';
import TaskListToolbar from './TaskListToolbar';
import TaskListPagination from './TaskListPagination';
import TaskListNavigation from './TaskListNavigation';

// Material UI
import { Theme, makeStyles, alpha } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TableContainer from '@material-ui/core/TableContainer';
import Paper from '@material-ui/core/Paper';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Table from '@material-ui/core/Table';

const useStyles = makeStyles((theme: Theme) => ({
  containerGrid: {
    position: 'relative',
  },
  tableRow: {
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.1),
    },
  },
}));

interface HeadCell {
  id: keyof ILoanApplicationListItem;
  labelCode: string;
  numeric: boolean;
}

const headCells: HeadCell[] = [
  {
    id: 'registerNumber',
    labelCode: 'REGISTER_NUMBER',
    numeric: false,
  },
  {
    id: 'iin',
    labelCode: 'IIN',
    numeric: false,
  },
  {
    id: 'fullname',
    labelCode: 'FULLNAME',
    numeric: false,
  },
  {
    id: 'loanProduct',
    labelCode: 'LOAN_PRODUCT',
    numeric: false,
  },
  {
    id: 'loanType',
    labelCode: 'LOAN_TYPE',
    numeric: false,
  },
  {
    id: 'loanStatus',
    labelCode: 'LOAN_STATUS',
    numeric: false,
  },
];

const TaskList: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();
  const { t } = useTranslation();
  const rootStore = useContext(RootStoreContext);
  const {
    loanApplications,
    order,
    orderBy,
    handleOrderingChange,
    getLoanApplications,
    pending,
  } = rootStore.loanApplicationListStore;

  useEffect(() => {
    getLoanApplications();
  }, [getLoanApplications]);

  return (
    <div>
      <TaskListToolbar />
      <Grid container spacing={2}>
        <Grid item xs={12} md={2}>
          <TaskListNavigation />
        </Grid>
        <Grid item xs={12} md={10} className={classes.containerGrid}>
          {pending ? (
            <Spinner />
          ) : (
            <Fragment>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>№</TableCell>
                      {headCells.map((headCell, idx) => (
                        <TableCell
                          key={idx}
                          align={headCell.numeric ? 'right' : 'left'}
                          sortDirection={
                            orderBy === headCell.id ? order : false
                          }
                        >
                          <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={() => handleOrderingChange(headCell.id)}
                          >
                            {t(`COMPONENTS.TASKS_LIST.${headCell.labelCode}`)}
                          </TableSortLabel>
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loanApplications.map((loanApplication, index) => (
                      <TableRow
                        key={index}
                        className={classes.tableRow}
                        onClick={() =>
                          history.push(
                            `/tasklist/${loanApplication.loanApplicationTaskId}`,
                          )
                        }
                      >
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{loanApplication.registerNumber}</TableCell>
                        <TableCell>{loanApplication.iin}</TableCell>
                        <TableCell>{loanApplication.fullname}</TableCell>
                        <TableCell>{loanApplication.loanProduct}</TableCell>
                        <TableCell>{loanApplication.loanType}</TableCell>
                        <TableCell>{loanApplication.loanStatus}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TaskListPagination />
            </Fragment>
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default observer(TaskList);
