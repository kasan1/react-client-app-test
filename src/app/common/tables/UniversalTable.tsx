import React from 'react';
import { ITableData, OrderDirection } from '../../models/common';

// Material UI
import { makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import { Dictionary } from 'lodash';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    marginBottom: theme.spacing(3),
  },
  title: {
    margin: theme.spacing(0, 2, 1, 2),
    fontWeight: 'bold',
    [theme.breakpoints.up('md')]: {
      fontSize: '1.8rem',
    },
  },
  cell: {
    background: '#eee',
    fontWeight: 'bold',
  },
}));

interface IProps {
  title: string | null;
  data: ITableData;
  handleOrderingChange?: (
    code: string,
    orderByDirection: OrderDirection,
  ) => void;
}

const UniversalTable: React.FC<IProps> = ({
  title,
  data,
  handleOrderingChange,
}) => {
  const classes = useStyles();
  const { header, body } = data;

  return (
    <div className={classes.root}>
      <Typography className={classes.title} variant="h6">
        {title}
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {header.map((item, idx) => (
                <TableCell
                  key={idx}
                  className={classes.cell}
                  sortDirection={item.isOrderBy ? item.orderByDirection : false}
                >
                  {handleOrderingChange ? (
                    <TableSortLabel
                      active={item.isOrderBy}
                      direction={item.orderByDirection}
                      onClick={() =>
                        handleOrderingChange(
                          item.code,
                          item.orderByDirection === 'asc' ? 'desc' : 'asc',
                        )
                      }
                    >
                      {item.name}
                    </TableSortLabel>
                  ) : (
                    item.name
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {body.map((item: Dictionary<any>, idx: number) => (
              <TableRow key={idx}>
                {header.map((head, index) => (
                  <TableCell key={index}>{item[head.code]}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default UniversalTable;
