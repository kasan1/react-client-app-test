import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { RootStoreContext } from '../../../app/stores/rootStore';

// Material UI
import TablePagination from '@material-ui/core/TablePagination';

const TaskListPagination = () => {
  const rootStore = useContext(RootStoreContext);
  const { page, pageLimit, count, handlePageChange, handlePageLimitChange } =
    rootStore.loanApplicationListStore;

  return (
    <TablePagination
      rowsPerPageOptions={[5, 10, 25]}
      component="div"
      count={count}
      page={page}
      rowsPerPage={pageLimit}
      onPageChange={handlePageChange}
      onRowsPerPageChange={handlePageLimitChange}
    />
  );
};

export default observer(TaskListPagination);
