import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  IContractsTable,
  LizingType,
} from '../../../../app/models/loanApplication';
import UniversalTable from '../../../../app/common/tables/UniversalTable';

// Material UI
import { makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
}));

interface IProps {
  data: IContractsTable;
  loanType: LizingType;
}

const Contracts: React.FC<IProps> = ({ data, loanType }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <div className={classes.root}>
      <UniversalTable
        title={t('COMPONENTS.CONTRACTS.CALCULATOR')}
        data={data.calculators}
        handleOrderingChange={(code, direction) => console.log(code, direction)}
      />
      <UniversalTable
        title={t('COMPONENTS.CONTRACTS.TECHNIQUES')}
        data={data.techniques}
        handleOrderingChange={(code, direction) => console.log(code, direction)}
      />
      {loanType === LizingType.Standard && (
        <UniversalTable
          title={t('COMPONENTS.CONTRACTS.PROVISIONS')}
          data={data.provisions}
          handleOrderingChange={(code, direction) =>
            console.log(code, direction)
          }
        />
      )}
    </div>
  );
};

export default Contracts;
