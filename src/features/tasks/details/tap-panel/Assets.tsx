import React from 'react';
import { useTranslation } from 'react-i18next';
import { IAssets } from '../../../../app/models/loanApplication';
import UniversalTable from '../../../../app/common/tables/UniversalTable';

interface IProps {
  data: IAssets;
}

const Assets: React.FC<IProps> = ({ data }) => {
  const { t } = useTranslation();

  return (
    <div>
      <UniversalTable
        title={t('COMPONENTS.ASSETS.LAND')}
        data={data.land}
        handleOrderingChange={(code, direction) => console.log(code, direction)}
      />
      <UniversalTable
        title={t('COMPONENTS.ASSETS.BIO')}
        data={data.bio}
        handleOrderingChange={(code, direction) => console.log(code, direction)}
      />
      <UniversalTable
        title={t('COMPONENTS.ASSETS.FLORA')}
        data={data.flora}
        handleOrderingChange={(code, direction) => console.log(code, direction)}
      />
      <UniversalTable
        title={t('COMPONENTS.ASSETS.TECH')}
        data={data.tech}
        handleOrderingChange={(code, direction) => console.log(code, direction)}
      />
    </div>
  );
};

export default Assets;
